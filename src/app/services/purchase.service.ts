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

  makePurchase(purchase: { quantity: string, userId: string, productId: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}purchase`, purchase,  { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  getPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.baseUrl}user/purchases`).pipe(
      map(data => data.map(purchase => this.mapPurchase(purchase))),
      catchError(this.handleError)
    );
  }

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

  searchPurchases(query: string): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.baseUrl}user/purchases/search`, { params: { query } }).pipe(
      map(data => data.map(purchase => this.mapPurchase(purchase))),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
