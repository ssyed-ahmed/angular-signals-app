import { FormControl } from '@angular/forms';
import { Gender } from './login.model';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: Gender;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthdate: string;
}

export interface UsersResponse {
  limit: number;
  skip: number;
  total: number;
  users: User[];
}

export interface UserEntity extends User {
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
