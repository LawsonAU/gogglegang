import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
    providedIn: 'root'
})

export class ApiInterfaceService {

    baseUrl = environment.domain;

    baseHeader: any; //header containing our api key
    baseHeaderNoAccessKey: any; //header containing no api key

    constructor(
        private http: HttpClient
    ) {
        this.baseHeader = new HttpHeaders();
        this.baseHeaderNoAccessKey = new HttpHeaders();
    }

    updateBaseUrl(base: boolean) {
        if (base) {
            this.baseUrl  = environment.domain;
        } else {
            this.baseUrl  = environment.marketDomain;
        }
    }

    updateAuthHeader(params?: any) {
        let auth = localStorage.getItem("auth");
        if (auth) {
            let parsedAuth = JSON.parse(auth);
            this.baseHeader = this.baseHeader.set('Authorization', 'Bearer ' + parsedAuth.token);

            if (params && Object.keys(params).length > 0) {
                for (let key in params) {
                    this.baseHeader = this.baseHeader.set(key, params[key]);
                }
            }
        }
    }

    updateAuthHeaderFreeAccess() {
        let auth = localStorage.getItem("auth");
        if (auth) {
            let parsedAuth = JSON.parse(auth);
            this.baseHeaderNoAccessKey = this.baseHeaderNoAccessKey.set('Authorization', 'Bearer ' + parsedAuth.token);
        }
    }

    get(path: any, params?: any) {
        this.updateAuthHeader(params);
        return this.http.get(this.baseUrl + path, { params: params, headers: this.baseHeader });
    }

    getResText(path: any, params?: any) {
        this.updateAuthHeader(params);
        return this.http.get(this.baseUrl + path, { params: params, headers: this.baseHeader, responseType: 'text' });
    }

    getNoKey(path: any, params?: any) {
        this.updateAuthHeaderFreeAccess();
        return this.http.get(this.baseUrl + path, { params: params, headers: this.baseHeaderNoAccessKey });
    }

    getResTextNoKey(path: any, params?: any) {
        this.updateAuthHeaderFreeAccess();
        return this.http.get(this.baseUrl + path, { params: params, headers: this.baseHeader, responseType: 'text' });
    }

    post(path: any, body?: any, params?: any) {
        this.updateAuthHeader();
        return this.http.post(this.baseUrl + path, body, { params: params, headers: this.baseHeader });
    }

    postResText(path: any, body?: any, params?: any) {
        this.updateAuthHeader();
        return this.http.post(this.baseUrl + path, body, { params: params, headers: this.baseHeader, responseType: 'text' });
    }

    postNoKey(path: any, body?: any, params?: any) {
        this.updateAuthHeaderFreeAccess();
        return this.http.post(this.baseUrl + path, body, { params: params, headers: this.baseHeader });
    }

    postResTextNoKey(path: any, body?: any, params?: any) {
        this.updateAuthHeaderFreeAccess();
        return this.http.post(this.baseUrl + path, body, { params: params, headers: this.baseHeader, responseType: 'text' });
    }

    put(path: any, body?: any, params?: any) {
        this.updateAuthHeader();
        return this.http.put(this.baseUrl + path, body, { params: params, headers: this.baseHeader });
    }

    putResText(path: any, body?: any, params?: any) {
        this.updateAuthHeader();
        return this.http.put(this.baseUrl + path, body, { params: params, headers: this.baseHeader, responseType: 'text' });
    }

    putNoKey(path: any, body?: any, params?: any) {
        this.updateAuthHeaderFreeAccess();
        return this.http.put(this.baseUrl + path, body, { params: params, headers: this.baseHeader });
    }

    putResTextNoKey(path: any, body?: any, params?: any) {
        this.updateAuthHeaderFreeAccess();
        return this.http.put(this.baseUrl + path, body, { params: params, headers: this.baseHeader, responseType: 'text' });
    }

    delete(path: any, params?: any) {
        this.updateAuthHeader();
        return this.http.delete(this.baseUrl + path, { params: params, headers: this.baseHeader });
    }

    deleteResText(path: any, params?: any) {
        this.updateAuthHeader();
        return this.http.delete(this.baseUrl + path, { params: params, headers: this.baseHeader, responseType: 'text' });
    }

    deleteNoKey(path: any, params?: any) {
        this.updateAuthHeaderFreeAccess();
        return this.http.delete(this.baseUrl + path, { params: params, headers: this.baseHeader });
    }

    deleteResTextNoKey(path: any, params?: any) {
        this.updateAuthHeaderFreeAccess();
        return this.http.delete(this.baseUrl + path, { params: params, headers: this.baseHeader, responseType: 'text' });
    }
}
