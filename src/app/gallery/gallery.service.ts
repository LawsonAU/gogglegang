import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GalleryService {

    constructor() { }

    filterData(images: any[], members: string[], areas: string[]): { name: string, selected: boolean }[] {
        let filters: { name: string, selected: boolean }[] = [];

        images.forEach((image) => {
            image.tags.forEach((tag) => {
                if (!members.includes(tag) && !areas.includes(tag) && !filters.some(filter => filter.name === tag)) {
                    filters.push({ name: tag, selected: false });
                }
            });
        });

        return filters.map(x => ({ name: this.adjustTxt(x.name), selected: x.selected }));
    }

    adjustTxt(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
    }
}
