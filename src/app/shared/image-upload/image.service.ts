import { Injectable } from '@angular/core';
import { ApiInterfaceService } from '../../api-interface.service'; // Adjust the path accordingly
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ImageService {

    constructor(
        private apiService: ApiInterfaceService
    ) { }

    getAllImages(): Observable<any> {
        return this.apiService.get('/images');
    }

    getImageById(id: string): Observable<any> {
        return this.apiService.get(`/images/${id}`);
    }

    createImage(image: any): Observable<any> {
        return this.apiService.post('/images', image);
    }

    updateImage(image: any, id): Observable<any> {
        return this.apiService.put(`/images/${id}`, image);
    }

    deleteImage(image: any): Observable<any> {
        return this.apiService.delete(`/images/${image.id}`);
    }
}
