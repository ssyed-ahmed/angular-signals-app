export enum Gender {
  male = 'male',
  female = 'female',
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  image: string;
  accessToken: string;
  refreshToken: string;
}
