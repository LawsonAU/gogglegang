import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoreRoutingModule } from './lore-routing.module';
import { LoreComponent } from './lore.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        LoreComponent
    ],
    imports: [
        CommonModule,
        LoreRoutingModule,
        SharedModule
    ]
})

export class LoreModule { }
