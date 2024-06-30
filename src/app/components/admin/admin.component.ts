import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  isMenuOpen = false;
  isUserMenuOpen = false;

  constructor(private router: Router) {}

  /**
   * @description Toggles the main menu open/closed state.
   */
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * @description Toggles the user menu open/closed state.
   */
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  /**
   * @description Logs out the user, removes the token from local storage, and navigates to the login page.
   */
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
