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

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}