import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private router: Router) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this.accountService.login(this.loginForm.value).subscribe({
        next: () => {
          const account = this.accountService.currentAccountValue;
          if (account?.roleId === 1) {
            this.router.navigateByUrl('/admin');
          } else if (account?.roleId === 2) {
            this.router.navigateByUrl('/user');
          }
        },
        error: error => {
          console.error("Fallido", error);
        }
      });
    }
  }
}
