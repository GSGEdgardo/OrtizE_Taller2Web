import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  //styleUrls: ['./user-nav.component.css']
})
export class UserNavComponent implements OnInit {
  isMenuOpen = false;
  isUserMenuOpen = false;
  userName: string | null = '';

  constructor(private router: Router, private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.currentAccount$.subscribe(account => {
      this.userName = account?.name || 'Cliente';
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
