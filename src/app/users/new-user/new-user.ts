import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NewUserForm, User, UserEntity } from '../../models/user';

@Component({
  selector: 'app-new-user',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './new-user.html',
  styleUrl: './new-user.scss',
})
export class NewUserComponent implements OnInit {
  activeModal = inject(NgbActiveModal);

  @Input() modalTitle = 'Add new user';
  @Input() userDetails: UserEntity | undefined = undefined;

  newUserForm = new FormGroup<NewUserForm>({
    userId: new FormControl(this.generateNewUserId(), {nonNullable: true}),
    firstName: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    middleName: new FormControl(''),
    lastName: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    emailId: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    mobileNo: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    altMobileNo: new FormControl(''),
  });

  generateNewUserId() {
    const numString = (Math.random() * 10000).toString(10);
    const num = numString.substring(0, numString.indexOf('.'));
    return Number(num);
  }

  addNewUser() {
    if (this.newUserForm.invalid) {
      this.newUserForm.markAsDirty();
      return;
    }
    if (this.newUserForm.valid) {
      this.activeModal.close(this.newUserForm.value);
    }
  }

  ngOnInit() {
    if (this.userDetails) {
      this.newUserForm.patchValue({
        userId: this.userDetails.id,
        firstName: this.userDetails.firstName,
        middleName: this.userDetails.middleName,
        lastName: this.userDetails.lastName,
        emailId: this.userDetails.emailId,
        mobileNo: this.userDetails.mobileNo,
        altMobileNo: this.userDetails.altMobileNo,
      });
    }
  }
}
