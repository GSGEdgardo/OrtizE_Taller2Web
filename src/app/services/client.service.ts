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

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  getGenders(): Observable<Gender[]> {
    return this.http.get<Gender[]>(`${this.baseUrl}/genders`).pipe(
      catchError(this.handleError)
    );
  }

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

  searchClients(query: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}/search`, { params: { query } }).pipe(
      catchError(this.handleError)
    );
  }

  changeClientState(id: number, newState: boolean): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/state`, `"${newState}"`, {
      headers: { 'Content-Type': 'application/json' },
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
