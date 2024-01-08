import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { trigger, style, transition, animate } from "@angular/animations";
import { LoginService } from './login.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [
        trigger('fade', [
            transition('void => *', [
                style({ opacity: 0 }),
                animate('400ms', style({ opacity: 1 })),
            ]),
            transition('* => void', [
                animate('400ms', style({ opacity: 0 })),
            ]),
        ]),
    ],
})

export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
    revolvingImages: string[] = [
        "../../assets/images/goggle-gang-base/trio-render.webp",
        "../../assets/images/goggle-gang-base/cxbby.webp",
        "../../assets/images/goggle-gang-base/edubbay.webp",
        "../../assets/images/goggle-gang-base/box.webp",
        "../../assets/images/goggle-gang-base/darkrichie.webp",
        "../../assets/images/goggle-gang-base/Yumemii-base.webp",
        "../../assets/images/goggle-gang-base/kesther.webp",
        "../../assets/images/goggle-gang-base/sedana.webp",
        "../../assets/images/goggle-gang-base/spooki.webp",
        "../../assets/images/gallery/sfw/shadres-fire-mage.webp",
    ];

    currentImage: string = "../../assets/images/gallery/sfw/shadres-boltcaster-nt.webp";
    private rotationInterval: any; // Store the interval ID for later cleanup
    username: string = '';
    password: string = '';
    isLoading: boolean = false;
    passwordHidden: boolean = true;

    constructor(
        private loginService: LoginService,
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer,
        private snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        private authService: AuthService, // Inject AuthService
        private router: Router // Inject Router
    ) {
        // Register icons for show/hide password button
        this.matIconRegistry.addSvgIcon(
            'visibility',
            this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/visibility.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'visibility_off',
            this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/visibility_off.svg')
        );
    }

    loginForm: FormGroup;
    get formControls() { return this.loginForm.controls; };
    get formValues() { return this.loginForm.value; };

    ngOnInit() {
        // Initialization logic if needed
        this.initForm();
    }

    initForm() {
        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', Validators.required],
            // other form controls...
        });
    }

    ngAfterViewInit(): void {
        this.rotateImages();
    }

    ngOnDestroy() {
        // Clear the interval when the component is destroyed
        clearInterval(this.rotationInterval);
    }

    rotateImages() {
        let currentIndex = 0;

        this.rotationInterval = setInterval(() => {
            this.currentImage = this.revolvingImages[currentIndex];
            currentIndex = (currentIndex + 1) % this.revolvingImages.length;
        }, 5000); // Change the duration (in milliseconds) to your desired interval
    }

    togglePasswordVisibility(event) {
        event.preventDefault();
        this.passwordHidden = !this.passwordHidden;
    }

    async onSubmit() {
        this.snackBar.open('Due to you having a head injury we cannot let you login at this time', 'Close', {
            duration: 5000,
            panelClass: ['snackbar-error']
        });

        return;

        if (this.loginForm.invalid) {
            this.snackBar.open('Please check the form for errors', 'Close', {
                duration: 3000,
                panelClass: ['snackbar-error']
            });
            return;
        }

        if (this.isLoading) {
            return;
        }

        localStorage.removeItem("auth");

        this.isLoading = true;

        try {
            const response: any = await this.loginService.login(
                this.loginForm.value.username,
                this.loginForm.value.password
            );
            console.log(response);

            if (response) {
                localStorage.setItem("auth",JSON.stringify(response));
                this.authService.setAuthenticated(true); // Set authentication status
                this.router.navigate(['/dashboard']); // Navigate to dashboard

            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.error ? error.error.details : 'An error occurred during login';
            this.snackBar.open(errorMessage, 'Close', {
                duration: 3000,
                panelClass: ['snackbar-error']
            });
        } finally {
            this.isLoading = false;
        }
    }

}
