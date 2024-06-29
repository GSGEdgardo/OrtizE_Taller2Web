import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { RegisterUser } from 'src/app/models/register-user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  genderOptions = [
    { id: '1', label: 'Masculino' },
    { id: '2', label: 'Femenino' },
    { id: '3', label: 'Prefiero no decirlo' },
    { id: '4', label: 'Otros' }
  ];

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private router: Router) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.registerForm = this.fb.group({
      rut: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{7,8}-[0-9kK]$')]
      ],
      name: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(255),
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$')]
      ],
      birthday: ['', [
        Validators.required,
        this.pastDateValidator()]
      ],
      email: ['', [
        Validators.required,
        Validators.email]
      ],
      gender: ['', [
        Validators.required]
      ],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z0-9]+$')]
      ],
      confirmPassword: ['', [
        Validators.required,
        this.matchValues('password')]
      ]
    });

    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { noMatching: true };
    };
  }

  pastDateValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const today = new Date();
      const birthDate = new Date(control.value);
      return birthDate < today ? null : { pastDate: true };
    };
  }

  formatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${month}/${day}/${year.substring(2, 4)}`;
  }

  setBackendErrors(errors: any): void {
    for (const key in errors) {
      if (this.registerForm.controls[key]) {
        this.registerForm.controls[key].setErrors({ backend: errors[key] });
      }
    }
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const values = { ...this.registerForm.value };
    values.birthday = this.formatDate(values.birthday);
    const selectedGender = this.genderOptions.find(g => g.label === values.gender);
    values.genderId = selectedGender ? selectedGender.id : null;

    const registerUser: RegisterUser = {
      rut: values.rut,
      name: values.name,
      birthday: values.birthday,
      email: values.email,
      genderId: values.genderId,
      password: values.password,
      confirmPassword: values.confirmPassword
    };

    this.accountService.register(registerUser).subscribe({
      next: (response) => {
        console.log("Registro exitoso");
        console.log(response);
        alert("Registro exitoso!");
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        console.error("Fallido", error.message);
        this.setBackendErrors(error.message);
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigateByUrl('/');
  }

  private markAllAsTouched(): void {
    Object.values(this.registerForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
