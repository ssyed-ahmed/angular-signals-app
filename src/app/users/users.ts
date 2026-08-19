import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { UsersStore } from '../store/users.store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../widgets/spinner/spinner';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { NewUserComponent } from './new-user/new-user';
import { User } from '../models/user';

@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule, SpinnerComponent, NgbPagination],
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  modalService = inject(NgbModal);
  router = inject(Router);
  filter = new FormControl('', { nonNullable: true });

  pageSize = 30;
  currentPage = signal(1);

  usersStore = inject(UsersStore);
  readonly users = this.usersStore.entities;
  filterQuery = toSignal(this.filter.valueChanges, { initialValue: '' });

  // filteredUsers = computed(() => {
  //   const query = this.filterQuery()?.toLowerCase() ?? '';
  //   return this.users().filter(
  //     (user) =>
  //       user.firstName.toLowerCase().includes(query) ||
  //       user.middleName?.toLowerCase().includes(query) ||
  //       user.lastName.toLowerCase().includes(query) ||
  //       user.emailId.toLowerCase().includes(query),
  //   );
  // });

  constructor() {
    effect(() => {
      // console.log(this.users());
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    const skip = (this.currentPage() - 1) * this.pageSize;
    const limit = this.pageSize;
    this.usersStore.getAllUsers({ limit, skip });
  }

  addNewUser() {
    const modalRef = this.modalService.open(NewUserComponent, {
      centered: true,
      size: 'lg',
    });

    modalRef.result.then((data) => {
      const newUser = {
        ...data,
      } as User;
      this.usersStore.addNewUser(newUser);
    });
  }

  openUserDetails(userId: number) {
    this.router.navigate(['/users', userId]);
  }

  navigateToPage(page: number) {
    this.currentPage.set(page);
    this.loadUsers();
  }
}
