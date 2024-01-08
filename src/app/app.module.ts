import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DisplayOutletComponent } from './display-outlet/display-outlet.component';
import { MenuComponent } from './menu/menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemComponent } from './item/item.component';
import { MaterialCssVarsModule } from "angular-material-css-vars";
import { MissingComponent } from './missing/missing.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    declarations: [
        AppComponent,
        DisplayOutletComponent,
        MenuComponent,
        ItemComponent,
        MissingComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        SharedModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialCssVarsModule.forRoot({
            // all optional
            isAutoContrast: true,
            primary: "#551F85",
            // ...
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})

export class AppModule { }
