import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/models/account';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  currentAccount: Account | null = null;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {
    this.changePasswordForm = this.fb.group({
      OldPassword: ['', Validators.required],
      NewPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]+$/)]],
      ConfirmNewPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.getCurrentAccount();
  }

  getCurrentAccount(): void {
    this.accountService.currentAccount$.subscribe(account => {
      this.currentAccount = account;
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('NewPassword')!.value === form.get('ConfirmNewPassword')!.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid && this.currentAccount) {
      const passwordData = {
        OldPassword: this.changePasswordForm.value.OldPassword,
        NewPassword: this.changePasswordForm.value.NewPassword,
        ConfirmNewPassword: this.changePasswordForm.value.ConfirmNewPassword
      };
      this.accountService.changePassword(this.currentAccount.id, passwordData).subscribe({
        next: () => {
          alert('Contraseña cambiada con éxito');
          this.accountService.logout();
          this.router.navigate(['/login']);
        },
        error: (err) => console.error(err)
      });
    }
  }
}
