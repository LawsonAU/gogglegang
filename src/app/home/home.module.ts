import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        HomeComponent,
        HeroDetailComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        SharedModule,
        FormsModule
    ]
})

export class HomeModule { }
