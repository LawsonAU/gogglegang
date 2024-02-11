import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryRoutingModule } from './gallery-routing.module';
import { GalleryComponent } from './gallery.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { PhotoGalleryModule } from '@twogate/ngx-photo-gallery'

@NgModule({
    declarations: [
        GalleryComponent
    ],
    imports: [
        CommonModule,
        GalleryRoutingModule,
        SharedModule,
        FormsModule,
        PhotoGalleryModule.forRoot({
            defaultOptions: {
              arrowEl: true,
              indexIndicatorSep: '-'
            }
        })
    ]
})

export class GalleryModule { }
