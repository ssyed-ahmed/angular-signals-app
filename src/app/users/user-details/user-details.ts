import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { UsersStore } from '../../store/users.store';
import { User, UserEntity } from '../../models/user';
import { SpinnerComponent } from '../../widgets/spinner/spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewUserComponent } from '../new-user/new-user';
import { ConfirmModalComponent } from '../../widgets/confirm-modal/confirm-modal';

@Component({
  selector: 'app-user-details',
  imports: [
    SpinnerComponent
  ],
  templateUrl: './user-details.html',
  styleUrls: ['./user-details.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsComponent implements OnInit {

  route = inject(ActivatedRoute);
  usersStore = inject(UsersStore);
  modalService = inject(NgbModal);

  readonly isLoading = computed<boolean>(() => {
    const userId = this.routeUserId();
    return userId !== null && this.usersStore.entities().length === 0;
  });

  private readonly routeUserId = toSignal(
    this.route.paramMap.pipe(
      map((params) => {
        const id = params.get('id');
        if (id === null) {
          return null;
        }

        const parsedId = Number(id);
        return Number.isNaN(parsedId) ? null : parsedId;
      })
    ),
    { initialValue: null }
  );
  readonly selectedUser = computed<UserEntity | undefined>(() => {
    const userId = this.routeUserId();
    if (userId === null) {
      return undefined;
    }

    return this.usersStore.entities().find((user) => user.id === userId);
  });

  ngOnInit() {
    if (this.usersStore.entities().length === 0) {
      this.usersStore.getAllUsers();
    }
  }

  editUserDetails() {
    const modalRef = this.modalService.open(NewUserComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.modalTitle = 'Edit user details';
    modalRef.componentInstance.userDetails = {
      ...this.selectedUser()
    };

    modalRef.result.then((data) => {
      const updatedUser = {
        ...data
      } as User;
      this.usersStore.updateUser(updatedUser);
    });
  }

  deleteUser() {
    const deleteUserFn = () => {
      const userId = this.routeUserId();
      this.usersStore.deleteUserByUserId(userId ?? 0);
    };
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.modalTitle = 'Delete user';
    modalRef.componentInstance.message = 'Are you sure you want to delete this user?';
    modalRef.componentInstance.actionOnConfirm = deleteUserFn;
  }
}
