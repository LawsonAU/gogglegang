import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryRoutingModule } from './gallery-routing.module';
import { GalleryComponent } from './gallery.component';
import { SharedModule } from '../shared/shared.module';
import { NgxMasonryModule } from 'ngx-masonry';
import { PhotoGalleryModule } from '@twogate/ngx-photo-gallery';
import { MasonryGalleryModule } from 'ngx-masonry-gallery';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        GalleryComponent
    ],
    imports: [
        CommonModule,
        GalleryRoutingModule,
        SharedModule,
        NgxMasonryModule,
        PhotoGalleryModule.forRoot({
            defaultOptions: {
                arrowEl: true,
                indexIndicatorSep: '-'
            }
        }),
        MasonryGalleryModule,
        FormsModule
    ]
})

export class GalleryModule { }
