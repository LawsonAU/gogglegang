import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { default as sfw } from '../../assets/images/gallery/sfw/sfw.json';
import { default as nsfw } from '../../assets/images/gallery/nsfw/nsfw.json';
import { animate, stagger, style, transition, trigger, query } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
    animations: [
        trigger('fadeStagger', [
            transition('* => *', [
                query(':enter', [
                    style({ opacity: 0, transform: 'translateY(25px)' }),
                    stagger(25, [
                        animate('250ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0px)' }))
                    ])
                ], { optional: true })
            ])
        ])
    ]
})
export class GalleryComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor() { }

    sfwDB: any = [];
    nsfwDB: any = [];

    showHideSearch: boolean = false;
    nsfwToggle: boolean = false;

    currentPage: number = 1;
    itemsPerPage: number = 30;
    totalItems: number;
    paginatedSfwDB: any[];
    paginatedNsfwDB: any[];
    galleryLoaded: boolean = false;
    loadedImages = 0;

    showSearchBar() {
        this.showHideSearch = !this.showHideSearch;
    }

    ngOnInit(): void {
        this.shuffleDBs();
    }

    shuffleDBs() {
        this.resetImgLoad();
        this.sfwDB = this.shuffleArray(sfw);
        this.nsfwDB = this.shuffleArray(nsfw);

        this.paginatedSfwDB = this.sfwDB.slice(0, this.paginator?.pageSize || this.itemsPerPage);
        this.paginatedNsfwDB = this.nsfwDB.slice(0, this.paginator?.pageSize || this.itemsPerPage);
        console.log(this.paginatedSfwDB,'paginatedSfwDB');
        console.log(this.paginatedNsfwDB,'paginatedNsfwDB');
    }

    ngAfterViewInit(): void {
        // Initialize paginated data after view and paginator are initialized
        if (this.paginator) {
            this.galleryLoaded = true; // Set to true after the initial load
        } else {
            // If the paginator is not yet available, set up a timeout to check again after a short delay
            setTimeout(() => this.ngAfterViewInit(), 100);
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    openImage(evt) {
        console.log(evt);
    }

    paginateSfwDB() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedSfwDB = this.sfwDB.slice(startIndex, endIndex);
    }

    paginateNsfwDB() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedNsfwDB = this.nsfwDB.slice(startIndex, endIndex);
    }

    nextPage() {
        this.resetImgLoad();
        if ((this.currentPage * this.itemsPerPage) < this.totalItems) {
            this.currentPage++;
            this.paginateSfwDB();
            this.paginateNsfwDB();
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.paginateSfwDB();
            this.paginateNsfwDB();
        }
    }

    onPageChange(event) {
        const startIndex = event.pageIndex * event.pageSize;

        if (!this.nsfwToggle) {
            this.paginatedSfwDB = this.sfwDB.slice(startIndex, startIndex + event.pageSize);
        } else {
            this.paginatedNsfwDB = this.nsfwDB.slice(startIndex, startIndex + event.pageSize);
        }
    }

    onImageLoad() {
        this.loadedImages++;
        console.log(this.loadedImages, 'loadedImages');
        if (this.loadedImages === this.paginator?.pageSize || this.itemsPerPage) {
            this.galleryLoaded = true;
        }
    }

    resetImgLoad() {
        this.loadedImages = 0;
        this.galleryLoaded = false;
    }
}
