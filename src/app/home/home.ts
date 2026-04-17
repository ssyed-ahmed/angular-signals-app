import { Component, inject, OnInit } from '@angular/core';
import { ToastService } from '../widgets/toast/toast.service';
import { ToastType } from '../models/common.model';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {

  toastService = inject(ToastService);

  ngOnInit() {
    // this.toastService.show(ToastType.warning, 'Hello world!');
  }
}
