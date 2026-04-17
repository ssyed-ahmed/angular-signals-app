export interface LoginResponse {
  message: string;
  result: boolean;
  data: {
    token: string;
  }
}
