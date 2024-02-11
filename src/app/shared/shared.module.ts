import { MaterialModule } from '../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ViewImageComponent } from './view-image/view-image.component';

@NgModule({
    declarations: [
        ImageUploadComponent,
        ViewImageComponent
  ],
    imports: [
        CommonModule,
        MaterialModule,
        NgxDropzoneModule
    ],
    exports: [
        MaterialModule,
        ImageUploadComponent,
        ViewImageComponent
    ]
})
export class SharedModule { }
