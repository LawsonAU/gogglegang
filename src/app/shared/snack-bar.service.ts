import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class CustomSnackBarService {

    constructor(
        private snackBar: MatSnackBar,
    ) { }

    showSnackBar(message: string, messageType: 'success' | 'warning' | 'error'): void {
        const config = new MatSnackBarConfig();
        config.duration = 5000;

        const panelClass = `custom-${messageType}-snackbar`;
        config.panelClass = [panelClass];

        this.snackBar.open(message, 'close', config);
    }
}
