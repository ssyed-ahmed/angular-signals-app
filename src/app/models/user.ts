import { FormControl } from '@angular/forms';

export interface User {
  firstName: string;
  lastName: string;
  middleName?: string;
  emailId: string;
  userId: number;
  mobileNo: string;
  altMobileNo?: string;
}

export type UserEntity = Omit<User, 'userId'> & {
  id: number;
}

export interface NewUserForm {
  userId: FormControl<number>;
  firstName: FormControl<string>;
  middleName?: FormControl<string | null>;
  lastName: FormControl<string>;
  emailId: FormControl<string>;
  mobileNo: FormControl<string>;
  altMobileNo?: FormControl<string | null>;
}
