import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArtRoutingModule } from './art-routing.module';
import { ArtComponent } from './art.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ArtComponent
  ],
  imports: [
    CommonModule,
    ArtRoutingModule,
    SharedModule
  ]
})
export class ArtModule { }
