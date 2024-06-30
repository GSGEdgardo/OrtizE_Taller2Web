import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Client, Gender } from '../models/client';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl: string = environment.apiUrl + 'user';

  constructor(private http: HttpClient) { }

  /**
   * @description Retrieves a list of clients.
   * @returns Observable<Client[]> An observable containing the list of clients.
   */
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * @description Retrieves a list of genders.
   * @returns Observable<Gender[]> An observable containing the list of genders.
   */
  getGenders(): Observable<Gender[]> {
    return this.http.get<Gender[]>(`${this.baseUrl}/genders`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * @description Updates the information of a client.
   * @param client Client The client information to update.
   * @returns Observable<void> An observable that completes when the update is successful.
   */
  updateClient(client: Client): Observable<void> {
    const clientDto = {
      editUserDto: {
        name: client.name,
        birthday: client.birthday,
        genderId: client.gender.id
      }
    };
    return this.http.put<void>(`${this.baseUrl}/${client.id}`, clientDto, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text' as 'json'
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * @description Searches for clients based on a query string.
   * @param query string The search query.
   * @returns Observable<Client[]> An observable containing the list of clients that match the query.
   */
  searchClients(query: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}/search`, { params: { query } }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * @description Changes the state of a client.
   * @param id number The client ID.
   * @param newState boolean The new state of the client.
   * @returns Observable<void> An observable that completes when the state change is successful.
   */
  changeClientState(id: number, newState: boolean): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/state`, `"${newState}"`, {
      headers: { 'Content-Type': 'application/json' },
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
