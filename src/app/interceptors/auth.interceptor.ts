import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    /**
     * @description Intercepts HTTP requests to add an Authorization header with the JWT token if it exists.
     * @param request HttpRequest<any> The outgoing HTTP request.
     * @param next HttpHandler The next handler in the chain.
     * @returns Observable<HttpEvent<any>> An observable of the HTTP event.
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token'); // Retrieves the token from local storage

        if (token) {
            // Clones the request and adds the Authorization header with the token
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        return next.handle(request); // Passes the request to the next handler in the chain
    }
}
