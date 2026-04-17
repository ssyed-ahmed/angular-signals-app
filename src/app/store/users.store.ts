import { User, UserEntity } from '../models/user';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { addEntity, removeEntity, setAllEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { catchError, EMPTY, finalize, pipe, switchMap, tap } from 'rxjs';
import { UsersService } from './users.service';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ToastService } from '../widgets/toast/toast.service';
import { ToastType } from '../models/common.model';
import { Router } from '@angular/router';

export type UsersState = {
  isLoading: boolean;
  error: string | null;
};

export const initialUsersState: UsersState = {
  isLoading: false,
  error: null,
};

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withDevtools('users'),
  withState(initialUsersState),
  withEntities<UserEntity>(),
  withMethods((
    store,
    usersService = inject(UsersService),
    toastService = inject(ToastService),
    router = inject(Router),
  ) => ({
    getAllUsers: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          usersService.getAllUsers().pipe(
            tap((users) => {
              patchState(
                store,
                setAllEntities(users),
              );
            }),
            catchError((error) => {
              patchState(store, { error: error.message });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false })),
          )
        ),
      )
    ),
    addNewUser: rxMethod<User>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((user: User) =>
          usersService.addNewUser(user).pipe(
            tap((newUser: UserEntity)=> {
              patchState(store, addEntity(newUser));
              toastService.show(ToastType.success, 'User successfully added.');
            }),
            catchError((error) => {
              patchState(store, { error: error.message });
              toastService.show(ToastType.danger, 'User creation failed.')
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false })),
          ),
        )
      )
    ),
    updateUser: rxMethod<User>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((user) =>
          usersService.updateUser(user).pipe(
            tap((updatedUser: UserEntity) => {
              patchState(
                store,
                updateEntity({
                  id: updatedUser.id,
                  changes: {
                    ...updatedUser,
                  }
                })
              );
              toastService.show(ToastType.success, 'User successfully updated.');
            }),
            catchError((error) => {
              patchState(store, { error: error.message });
              toastService.show(ToastType.danger, 'User update failed.')
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false })),
          )
        )
      )
    ),
    deleteUserByUserId: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((userId) =>
          usersService.deleteUser(userId).pipe(
            tap(() => {
              patchState(
                store,
                removeEntity(userId)
              );
              router.navigateByUrl('/users');
              toastService.show(ToastType.success, 'User successfully deleted.');
            }),
            catchError((error) => {
              patchState(store, { error: error.message });
              toastService.show(ToastType.danger, 'User delete failed.')
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false })),
          )
        )
      )
    )
  }))
);
