import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Alert, ToastType } from '../../models/common.model';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrls: ['./toast.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {
  @Input() type: ToastType = ToastType.danger;
  @Input() message: string = '';
  protected readonly ToastType = ToastType;

  toastService = inject(ToastService);
}
