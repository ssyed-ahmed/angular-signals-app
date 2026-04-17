import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.html',
  styleUrls: ['./confirm-modal.scss'],
})
export class ConfirmModalComponent {

  @Input() modalTitle = 'Confirm';
  @Input() message = '';
  @Input() actionOnConfirm!: () => void;

  activeModal = inject(NgbActiveModal);

  confirm() {
    this.activeModal.close();
    this.actionOnConfirm();
  }

  cancel() {
    this.activeModal.dismiss('cancel');
  }
}
