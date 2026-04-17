export enum ToastType {
  success = 'success',
  warning = 'warning',
  danger = 'danger',
  info = 'info'
}

export interface Alert {
  id: number;
  message: string;
  type: ToastType;
}
