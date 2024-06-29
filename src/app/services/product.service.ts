import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { Product } from "../models/product";
import { environment } from "src/environments/environment";
import { ProductType } from "../models/product-type";

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    baseUrl: string = environment.apiUrl + 'product/';

    constructor(private http: HttpClient) { }

    /**
     * Gets all products from the server.
     * @returns An Observable of Product array.
     */
    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.baseUrl}`);
    }

    /**
     * Gets all product types from the server.
     * @returns An Observable of ProductType array.
     */
    getProductTypes(): Observable<ProductType[]> {
        return this.http.get<ProductType[]>(`${this.baseUrl}types`);
    }

    getAvailableProducts(page: number, size: number): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.baseUrl}available/${page}/${size}`).pipe(
            catchError(this.handleError)
        );
    }

    searchAvailableProducts(query: string, page: number, size: number): Observable<Product[]> {
        const params = { query, page: page.toString(), size: size.toString() };
        return this.http.get<Product[]>(`${this.baseUrl}available/search`, { params }).pipe(
            catchError(this.handleError)
        );
    }
    
    /**
     * Adds a new product.
     * @param product The form data of the product to be added.
     * @returns An Observable of the server response.
     */
    addProduct(product: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}`, product, { responseType: 'text' });
    }

    /**
     * Edits an existing product.
     * @param id The ID of the product to be edited.
     * @param product The form data of the product to be edited.
     * @returns An Observable of the server response.
     */
    editProduct(id: number, product: FormData): Observable<any> {
        return this.http.put(`${this.baseUrl}${id}`, product, { responseType: 'text' });
    }

    /**
     * Deletes a product.
     * @param id The ID of the product to be deleted.
     * @returns An Observable of the server response.
     */
    deleteProduct(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}${id}`, { responseType: 'text' });
    }

    /**
     * Searches for products based on a query.
     * @param query The search query.
     * @returns An Observable of Product array.
     */
    searchProducts(query: string): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.baseUrl}search`, { params: { query } });
      }
    
    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }
}
