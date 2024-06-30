import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Account } from '../models/account';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { RegisterUser } from '../models/register-user';

/**
 * @description Extracts the role from the JWT token.
 * @param token string The JWT token.
 * @returns string The role extracted from the token.
 */
function extractRoleFromToken(token: string): string {
  const decodedToken: any = jwtDecode(token);
  return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  //apiUrl: string = 'https://localhost:PORT/api/';
  baseUrl: string = environment.apiUrl;
  private currentAccountSource = new BehaviorSubject<Account | null>(null);
  currentAccount$ = this.currentAccountSource.asObservable();

  get currentAccountValue(): Account | null {
    return this.currentAccountSource.value;
  }

  constructor(private http: HttpClient) { }

  /**
   * @description Logs in the user.
   * @param model any The login credentials.
   * @returns Observable<void> An observable that completes when the login is successful.
   */
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

  /**
   * @description Sets the current account.
   * @param account Account The account to set.
   */
  setCurrentAccount(account: Account): void {
    localStorage.setItem('account', JSON.stringify(account));
    this.currentAccountSource.next(account);
  }

  /**
   * @description Registers a new user.
   * @param model RegisterUser The registration details.
   * @returns Observable<any> An observable that completes when the registration is successful.
   */
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

  /**
   * @description Logs out the current user.
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('account');
    this.currentAccountSource.next(null);
  }

  /**
   * @description Changes the password of the current user.
   * @param id number The user ID.
   * @param data { OldPassword: string, NewPassword: string, ConfirmNewPassword: string } The password change details.
   * @returns Observable<void> An observable that completes when the password change is successful.
   */
  changePassword(id: number, data: { OldPassword: string, NewPassword: string, ConfirmNewPassword: string }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}user/${id}/password`, data, {
      responseType: 'text' as 'json'
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * @description Handles HTTP errors.
   * @param error HttpErrorResponse The HTTP error response.
   * @returns Observable<never> An observable that throws an error.
   */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
