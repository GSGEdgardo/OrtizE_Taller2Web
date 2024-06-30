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
     * @description Gets all products from the server.
     * @returns Observable<Product[]> An observable containing an array of products.
     */
    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.baseUrl}`);
    }

    /**
     * @description Gets all product types from the server.
     * @returns Observable<ProductType[]> An observable containing an array of product types.
     */
    getProductTypes(): Observable<ProductType[]> {
        return this.http.get<ProductType[]>(`${this.baseUrl}types`);
    }

    /**
     * @description Gets available products with pagination.
     * @param page number The page number.
     * @param size number The size of the page.
     * @returns Observable<Product[]> An observable containing an array of available products.
     */
    getAvailableProducts(page: number, size: number): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.baseUrl}available/${page}/${size}`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * @description Searches for available products based on a query with pagination.
     * @param query string The search query.
     * @param page number The page number.
     * @param size number The size of the page.
     * @returns Observable<Product[]> An observable containing an array of products matching the query.
     */
    searchAvailableProducts(query: string, page: number, size: number): Observable<Product[]> {
        const params = { query, page: page.toString(), size: size.toString() };
        return this.http.get<Product[]>(`${this.baseUrl}available/search`, { params }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * @description Adds a new product.
     * @param product FormData The form data of the product to be added.
     * @returns Observable<any> An observable of the server response.
     */
    addProduct(product: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}`, product, { responseType: 'text' });
    }

    /**
     * @description Edits an existing product.
     * @param id number The ID of the product to be edited.
     * @param product FormData The form data of the product to be edited.
     * @returns Observable<any> An observable of the server response.
     */
    editProduct(id: number, product: FormData): Observable<any> {
        return this.http.put(`${this.baseUrl}${id}`, product, { responseType: 'text' });
    }

    /**
     * @description Deletes a product.
     * @param id number The ID of the product to be deleted.
     * @returns Observable<any> An observable of the server response.
     */
    deleteProduct(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}${id}`, { responseType: 'text' });
    }

    /**
     * @description Searches for products based on a query.
     * @param query string The search query.
     * @returns Observable<Product[]> An observable containing an array of products matching the query.
     */
    searchProducts(query: string): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.baseUrl}search`, { params: { query } });
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
