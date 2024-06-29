import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Purchase } from '../models/purchase';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  makePurchase(purchase: { quantity: string, userId: string, productId: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}purchase`, purchase,  { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  getPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.baseUrl}user/purchases`).pipe(
      catchError(this.handleError)
    );
  }

  searchPurchases(query: string): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.baseUrl}user/purchases/search`, { params: { query } }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
