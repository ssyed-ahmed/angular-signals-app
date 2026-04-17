import { Component, inject } from '@angular/core';
import { CounterStore } from './counter.store';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './widgets/toast/toast';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [
    RouterOutlet,
    ToastComponent
  ]
})
export class AppComponent {
  protected readonly title = 'angular-signals-app';
  protected readonly counterStore = inject(CounterStore);
}
