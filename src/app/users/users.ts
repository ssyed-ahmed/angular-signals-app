import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { UsersStore } from '../store/users.store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import { SpinnerComponent } from '../widgets/spinner/spinner';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewUserComponent } from './new-user/new-user';
import { User } from '../models/user';

@Component({
  selector: 'app-users',
  imports: [
    ReactiveFormsModule,
    SpinnerComponent
  ],
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {

  modalService = inject(NgbModal);
  router = inject(Router);
  filter = new FormControl('', { nonNullable: true });

  usersStore = inject(UsersStore);
  readonly users = this.usersStore.entities;
  filterQuery = toSignal(this.filter.valueChanges, { initialValue: ''});

  filteredUsers = computed(() => {
    const query = this.filterQuery()?.toLowerCase() ?? '';
    return this.users().filter(user =>
      user.firstName.toLowerCase().includes(query) ||
      user.middleName?.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.emailId.toLowerCase().includes(query));
  });

  constructor() {
    effect(() => {
      // console.log(this.users());
    });
  }

  ngOnInit() {
    if (this.users().length === 0) {
      this.fetchAllUsers();
    }
  }

  addNewUser() {
    const modalRef = this.modalService.open(NewUserComponent, {
      centered: true,
      size: 'lg',
    });

    modalRef.result.then((data) => {
      const newUser = {
        ...data
      } as User;
      this.usersStore.addNewUser(newUser);
    });
  }

  openUserDetails(userId: number) {
    this.router.navigate(['/users', userId]);
  }

  private fetchAllUsers() {
    this.usersStore.getAllUsers();
  }
}
