import { Injectable } from '@angular/core';
import { default as cmsThemeList } from '../cms_themes.json';
import { ApiInterfaceService } from './api-interface.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialCssVarsService } from 'angular-material-css-vars';

@Injectable({
    providedIn: 'root'
})
export class MainService {

    constructor(
        private api: ApiInterfaceService,
        private _snackBar: MatSnackBar,
        private materialCssVarsService: MaterialCssVarsService
    ) { }

    lightModeTheme = cmsThemeList.PROJECT;
    darkModeTheme = cmsThemeList.PROJECT_DARK;

    darkMode: boolean = true;

    errorMsg(msg) {
        this._snackBar.open(msg, 'close', {
            panelClass: 'snackBarError',
            duration: 5000,
        });
    }

    setDefaultTheme() {
        console.log(this.darkMode);
        let theme: any = cmsThemeList.PROJECT;
        theme.logoImage = '../../assets/images/NW Full Wht.png';

        if (this.darkMode) {
            theme.variables = JSON.parse(JSON.stringify(this.darkModeTheme.variables));
        } else {
            theme.variables = JSON.parse(JSON.stringify(this.lightModeTheme.variables));
        }

        for (let vItem of theme.variables) {
            document.documentElement.style.setProperty(vItem.key, vItem.value);
            if (vItem.key == "--primary-color") {
                this.materialCssVarsService.setPrimaryColor(vItem.value);
            }

            if (vItem.key == "--accent-color") {
                this.materialCssVarsService.setAccentColor(vItem.value);
            }
        }
        this.materialCssVarsService.setDarkTheme(this.darkMode);
    }
}
