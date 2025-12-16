import { Component, effect, signal } from '@angular/core';
import { NavigationMenuComponent } from '@shared/components/navigation-menu/navigation-menu.component';
import {
  Calendar,
  Menu,
  X,
  LucideAngularModule,
} from 'lucide-angular';
import { NgClass } from '@angular/common';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  imports: [
    TranslocoPipe,
    NavigationMenuComponent,
    NgClass,
    LucideAngularModule,
    NgxPermissionsModule,
  ],
  templateUrl: './mobile-header.component.html',
  styleUrl: './mobile-header.component.scss',
})
export class MobileHeaderComponent {
  isMenuOpen = signal<boolean>(false);
  protected readonly Calendar = Calendar;
  protected readonly Menu = Menu;
  protected readonly X = X;

  constructor() {
    effect(() => {
      document.body.style.overflow = this.isMenuOpen() ? 'hidden' : 'auto';
    })
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}
