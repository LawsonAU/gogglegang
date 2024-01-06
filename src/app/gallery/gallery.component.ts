import { Component, OnInit } from '@angular/core';
import { default as sfw } from '../../assets/images/gallery/sfw/sfw.json';
import { default as nsfw } from '../../assets/images/gallery/nsfw/nsfw.json';
import { animate, stagger, style, transition, trigger, query } from '@angular/animations';
import { NgxMasonryOptions } from 'ngx-masonry';
import { IMasonryGalleryImage } from 'ngx-masonry-gallery';
import * as Masonry from 'masonry-layout';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
    animations: [
        trigger('fadeStagger', [
            transition('* => *', [
                query(':enter', [
                    style({ opacity: 0, transform: 'translateY(25px)', }),
                    stagger(25, [
                        animate('250ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0px)' }))
                    ])
                ], { optional: true })
            ])
        ])
    ]
})

export class GalleryComponent implements OnInit {

    constructor() { }

    sfwDB: any = [];
    nsfwDB: any = [];

    showHideSearch: boolean = false;
    nsfwToggle: boolean = false;

    animations = {
        show: [
          style({opacity: 0}),
          animate('400ms ease-in', style({opacity: 1, transform: 'translateY(-25px)'})),
        ],
        hide: [
          style({opacity: '*'}),
          animate('400ms ease-in', style({opacity: 0, transform: 'translateY(25px)'})),
        ]
    }

    showSearchBar() {
        this.showHideSearch = !this.showHideSearch;
    }

    ngOnInit(): void {
        this.sfwDB = this.shuffleArray(sfw);
        this.nsfwDB = this.shuffleArray(nsfw);
        console.log(this.sfwDB, 'sfwDB');
        console.log(this.nsfwDB, 'nsfwDB');
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    openImage(evt) {
        console.log(evt)
    }
}

