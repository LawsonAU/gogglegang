import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    setAuthenticated(value: boolean) {
        this.isAuthenticatedSubject.next(value);
    }

    get isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }

    private isServerSubject = new BehaviorSubject<boolean>(false);
    isServer$ = this.isServerSubject.asObservable();

    setServer(value: boolean) {
        this.isServerSubject.next(value);
    }

    get isServer(): boolean {
        return this.isServerSubject.value;
    }
}
