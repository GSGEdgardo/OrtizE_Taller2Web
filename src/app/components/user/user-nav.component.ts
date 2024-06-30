import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  // styleUrls: ['./user-nav.component.css']
})
export class UserNavComponent implements OnInit {
  isMenuOpen = false;
  isUserMenuOpen = false;
  userName: string | null = '';

  constructor(private router: Router, private accountService: AccountService) {}

  /**
   * @description Initializes the component. Subscribes to the current account and sets the user name.
   */
  ngOnInit(): void {
    this.accountService.currentAccount$.subscribe(account => {
      this.userName = account?.name || 'Cliente';
    });
  }

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
