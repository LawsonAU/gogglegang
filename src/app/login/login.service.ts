import { Injectable } from '@angular/core';
import { ApiInterfaceService } from '../api-interface.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
    providedIn: 'root'
})

export class LoginService {
    constructor(
        private api: ApiInterfaceService,
        private router: Router,
        private authService: AuthService, // Inject AuthService
    ) { }

    async login(email: string, password: string) {
        try {
            let res: any = await this.api.postNoKey('login', { username: email, password: password }).toPromise();
            return res;
        } catch (e) {
            console.log(e);
            const error = e.error;
            throw new Error(error);
        }
    }

    logout(): void {
        // Your logout logic here
        // Clear authentication status and redirect to home page
                this.authService.setAuthenticated(false); // Set authentication status
        localStorage.removeItem('auth');
        this.router.navigate(['/']);
      }
}
