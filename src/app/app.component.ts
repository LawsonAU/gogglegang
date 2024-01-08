import { Component } from '@angular/core';
import { MainService } from './main.service';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {
    title = 'new-world';

    constructor (
        private mainService: MainService,
        private authService: AuthService, // Inject AuthService
    ) { }

    ngOnInit() {
        this.mainService.setDefaultTheme();
        let auth = JSON.parse(localStorage.getItem("auth"));
        if (auth) {
            this.authService.setAuthenticated(true); // Set authentication status
        }
    }
}
