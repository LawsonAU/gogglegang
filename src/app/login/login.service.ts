import { Injectable } from '@angular/core';
import { ApiInterfaceService } from '../api-interface.service';
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

    }

    logout(): void {
        // Your logout logic here
        // Clear authentication status and redirect to home page
                this.authService.setAuthenticated(false); // Set authentication status
        localStorage.removeItem('auth');
        this.router.navigate(['/']);
      }
}
