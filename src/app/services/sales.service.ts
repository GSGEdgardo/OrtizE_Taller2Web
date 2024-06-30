import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Purchase } from '../models/purchase';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * @description Retrieves all purchases.
   * @returns Observable<Purchase[]> An observable containing an array of purchases.
   */
  getPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.baseUrl}user/purchases`).pipe(
      map((purchases: any[]) => purchases.map(purchase => ({
        id: purchase.id,
        purchaseDate: purchase.purchase_Date,
        productId: purchase.productId,
        productName: purchase.productName,
        productType: purchase.productType,
        productPrice: purchase.productPrice,
        quantity: purchase.quantity,
        totalPrice: purchase.totalPrice,
        userId: purchase.userId,
        userName: purchase.user ? purchase.user.name : 'N/A'
      }))),
      catchError(this.handleError)
    );
  }

  /**
   * @description Searches for purchases based on a query.
   * @param query string The search query.
   * @returns Observable<Purchase[]> An observable containing an array of purchases matching the query.
   */
  searchPurchases(query: string): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.baseUrl}user/purchases/search`, { params: { query } }).pipe(
      map((purchases: any[]) => purchases.map(purchase => ({
        id: purchase.id,
        purchaseDate: purchase.purchase_Date,
        productId: purchase.productId,
        productName: purchase.productName,
        productType: purchase.productType,
        productPrice: purchase.productPrice,
        quantity: purchase.quantity,
        totalPrice: purchase.totalPrice,
        userId: purchase.userId,
        userName: purchase.user ? purchase.user.name : 'N/A'
      }))),
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
