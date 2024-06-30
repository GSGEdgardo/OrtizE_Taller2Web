import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Purchase } from '../models/purchase';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * @description Makes a purchase.
   * @param purchase { quantity: string, userId: string, productId: string } The purchase details.
   * @returns Observable<any> An observable of the server response.
   */
  makePurchase(purchase: { quantity: string, userId: string, productId: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}purchase`, purchase,  { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * @description Retrieves all purchases.
   * @returns Observable<Purchase[]> An observable containing an array of purchases.
   */
  getPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.baseUrl}user/purchases`).pipe(
      map(data => data.map(purchase => this.mapPurchase(purchase))),
      catchError(this.handleError)
    );
  }

  /**
   * @description Maps a raw purchase object to a Purchase model.
   * @param purchase any The raw purchase object.
   * @returns Purchase The mapped Purchase model.
   */
  private mapPurchase(purchase: any): Purchase {
    return {
      id: purchase.id,
      purchaseDate: purchase.purchase_Date,
      productId: purchase.productId,
      productName: purchase.productName,
      productType: purchase.productType,
      productPrice: purchase.productPrice,
      quantity: purchase.quantity,
      totalPrice: purchase.totalPrice,
      userId: purchase.user.id,
      userName: purchase.user.name
    };
  }

  /**
   * @description Searches for purchases based on a query.
   * @param query string The search query.
   * @returns Observable<Purchase[]> An observable containing an array of purchases matching the query.
   */
  searchPurchases(query: string): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.baseUrl}user/purchases/search`, { params: { query } }).pipe(
      map(data => data.map(purchase => this.mapPurchase(purchase))),
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
