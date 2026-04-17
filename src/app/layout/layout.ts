import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { AuthStore } from '../store/auth.store';
import { BreadcrumbComponent } from '../widgets/breadcrumb/breadcrumb';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, NgbCollapse, RouterLink, RouterLinkActive, BreadcrumbComponent],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
})
export class LayoutComponent implements OnInit {
  isMenuCollapsed = false;
  selectedMenu = 'home';
  isFooterVisible = false;

  authStore = inject(AuthStore);
  router = inject(Router);

  ngOnInit() {
    this.updateFooterVisibility();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportChanged() {
    this.updateFooterVisibility();
  }

  handleSignOut() {
    this.authStore.logout();
    this.router.navigate(['/login']);
  }

  private updateFooterVisibility() {
    const scrollBottom = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    this.isFooterVisible = scrollBottom >= pageHeight - 2;
  }
}
