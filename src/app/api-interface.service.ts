import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../src/environments/environment.prod';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApiInterfaceService {

    private baseUrl: string;

    private baseHeaders: HttpHeaders = new HttpHeaders();
    private baseHeadersNoAccessKey: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(private http: HttpClient) {
        this.baseUrl = environment.domain;
    }

    private updateBaseUrl(base: boolean): void {
        this.baseUrl = base ? environment.domain : environment.marketDomain;
    }

    private updateAuthHeaders(params?: any): void {
        const auth = localStorage.getItem("auth");
        if (auth) {
            const parsedAuth = JSON.parse(auth);
            this.baseHeaders = this.baseHeaders.set('Authorization', 'Bearer ' + parsedAuth.token);

            if (params && Object.keys(params).length > 0) {
                for (const key in params) {
                    this.baseHeaders = this.baseHeaders.set(key, params[key]);
                }
            }
        }
    }

    private handleError(error: any): Observable<never> {
        console.error('An error occurred:', error);
        return throwError(error);
    }

    private prepareOptions(params?: any, responseType?: 'json' | 'text'): { params?: HttpParams, headers?: HttpHeaders, responseType?: 'json' } {
        const options: any = { headers: this.baseHeaders };
        if (params) options.params = new HttpParams({ fromObject: params });
        options.responseType = responseType === 'text' ? 'text' : 'json';
        return options;
    }

    // Public Methods

    public setBaseUrl(base: boolean): void {
        this.updateBaseUrl(base);
    }

    public setAuthHeaders(params?: any): void {
        this.updateAuthHeaders(params);
    }

    public get(path: string, params?: any): Observable<any> {
        this.updateAuthHeaders(params);
        return this.http.get(`${this.baseUrl}${path}`, this.prepareOptions(params))
            .pipe(catchError(this.handleError));
    }

    public post(path: string, body?: any, params?: any): Observable<any> {
        this.updateAuthHeaders();
        return this.http.post(`${this.baseUrl}${path}`, body, this.prepareOptions(params))
            .pipe(catchError(this.handleError));
    }

    public put(path: string, body?: any, params?: any): Observable<any> {
        this.updateAuthHeaders();
        return this.http.put(`${this.baseUrl}${path}`, body, this.prepareOptions(params))
            .pipe(catchError(this.handleError));
    }

    public delete(path: string, params?: any): Observable<any> {
        this.updateAuthHeaders();
        return this.http.delete(`${this.baseUrl}${path}`, this.prepareOptions(params))
            .pipe(catchError(this.handleError));
    }
}
