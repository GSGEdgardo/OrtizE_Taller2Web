import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Account } from '../models/account';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { RegisterUser } from '../models/register-user';

function extractRoleFromToken(token: string): string {
  const decodedToken: any = jwtDecode(token);
  return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl: string = environment.apiUrl;
  private currentAccountSource = new BehaviorSubject<Account | null>(null);
  currentAccount$ = this.currentAccountSource.asObservable();

  get currentAccountValue(): Account | null {
    return this.currentAccountSource.value;
  }

  constructor(private http: HttpClient) { }

  login(model: any): Observable<void> {
    return this.http.post<{ user: any, token: string }>(this.baseUrl + 'auth/login', model).pipe(
      map(response => {
        const role = extractRoleFromToken(response.token);
        localStorage.setItem('token', response.token);
        const account: Account = {
          id: response.user.id,
          email: response.user.email,
          token: response.token,
          roleId: role === "Admin" ? 1 : 2,
          roleType: role,
          name: response.user.name,
          isActive: response.user.isActive,
        };

        if (account) {
          this.setCurrentAccount(account);
        }
      })
    );
  }

  setCurrentAccount(account: Account): void {
    localStorage.setItem('account', JSON.stringify(account));
    this.currentAccountSource.next(account);
  }

  register(model: RegisterUser): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'auth/register', model).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error.errors) {
          return throwError(() => new Error(error.error.errors));
        } else {
          return throwError(() => new Error('An unknown error occurred.'));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('account');
    this.currentAccountSource.next(null);
  }

  changePassword(id: number, data: { OldPassword: string, NewPassword: string, ConfirmNewPassword: string }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}user/${id}/password`, data, {
      responseType: 'text' as 'json'
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
