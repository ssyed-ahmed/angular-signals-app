import { Injectable, signal } from '@angular/core';
import { Alert, ToastType } from '../../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSignal = signal<Alert[]>([]);
  toasts = this.toastsSignal.asReadonly();

  private idCounter = 0;

  show(type: ToastType, message: string) {
    const id = ++this.idCounter;

    this.toastsSignal.update(alerts => [
      ...alerts,
      { id, type, message }
    ]);

    setTimeout(() => this.hide(id), 5000);
  }

  hide(id: number) {
    this.toastsSignal.update(alerts =>
      alerts.filter(a => a.id !== id)
    );
  }
}
