import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { animate, stagger, style, transition, trigger, query, state } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { default as sfw } from '../../assets/images/gallery/sfw/sfw.json';
import { default as nsfw } from '../../assets/images/gallery/nsfw/nsfw.json';
import { GalleryService } from './gallery.service';

interface Member {
    name: string;
    route: string;
    icon: string;
    selected: boolean;
}

interface Area {
    name: string;
    selected: boolean;
}

interface Image {
    name: string;
    tags: string[];
    // Add other properties as needed
}

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
        ]),
        trigger("showHideFilter", [
            state("collapsed", style({ height: "0px", overflow: "hidden", opacity: 0, paddingBottom: "0px" })),
            state("expanded", style({ height: "*", opacity: 1, paddingBottom: "30px" })),
            transition(
                "expanded <=> collapsed",
                animate("350ms cubic-bezier(0.4, 0.0, 0.2, 1)")
            ),
        ])
    ]
})
export class GalleryComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private galleryService: GalleryService) { }

    sfwDB: any = [];
    nsfwDB: any = [];
    sfwFilteredDB: any = [];
    nsfwFilteredDB: any = [];

    showHideSearch: boolean = false;
    nsfwToggle: boolean = false;

    currentPage: number = 1;
    itemsPerPage: number = 30;
    totalItems: number;
    paginatedSfwDB: any[];
    paginatedNsfwDB: any[];
    galleryLoaded: boolean = false;
    loadedImages = 0;

    filters: string[] = [];

    showFilterTags: boolean = false;
    showFilterMembers: boolean = true;
    showFilterAreas: boolean = false;
    filtersActive: boolean = false;

    members = [
        "Box",
        "Shadres",
        "FreezingTemps",
        "Cxbby",
        "Edubbay",
        "Yumemii",
        "Kesther",
        "Spooki",
        "Sedana"
    ];

    membersExt = [
        { name: 'Shadres', route: '/detail/shadres', icon: '../../assets/images/role-icons/archer.png', selected: false },
        { name: 'Cxbby', route: '/detail/cxbby', icon: '../../assets/images/role-icons/healer.png', selected: false },
        { name: 'Edubbay', route: '/detail/edubbay', icon: '../../assets/images/role-icons/Gunner.png', selected: false },
        { name: 'Freezingtemps', route: '/detail/freezingtemps', icon: '../../assets/images/role-icons/tank.png', selected: false },
        { name: 'Spooki', route: '/detail/spooki', icon: '../../assets/images/role-icons/ab-wizard.png', selected: false },
        { name: 'Sedana', route: '/detail/sedana', icon: '../../assets/images/role-icons/kill-thief.png', selected: false },
        { name: 'Kesther', route: '/detail/kesther', icon: '../../assets/images/role-icons/magician.png', selected: false },
        { name: 'Yumemii', route: '/detail/yumemii', icon: '../../assets/images/role-icons/healer.png', selected: false },
        { name: 'Box', route: '/detail/box', icon: '../../assets/images/role-icons/warrior.png', selected: false }
    ];

    areas = [
        "Reekwater", "Everfall", "First Light", "Weaver's Fen", "Cutlass Keys", "Great Cleave", "Brightwood",
        "Mourningdale", "Edengrove", "Restless Shore", "Windsward", "Monarch's Bluffs", "Shattered Mountain",
        "Ebonscale Reach", "Morningdale", "Restless Shore", "Windsward", "Brimstone Sands", "Elysian Wilds"
    ];

    areasObjects = this.areas.map(area => ({ name: area, selected: false }));

    sfwFilters: any = [];
    nsfwFilters: any = [];

    showSearchBar() {
        this.showHideSearch = !this.showHideSearch;
    }

    ngOnInit(): void {
        this.shuffleDBs();
        this.getFilters();
    }

    getFilters() {
        this.sfwFilters = this.galleryService.filterData(sfw, this.members, this.areas);
        this.nsfwFilters = this.galleryService.filterData(nsfw, this.members, this.areas);
        console.log(this.sfwFilters, 'sfwFilters');
        console.log(this.nsfwFilters, 'nsfwFilters');
    }

    shuffleDBs() {
        this.clearFilterData();
        //this.resetImgLoad();
        this.sfwDB = this.shuffleArray(sfw);
        this.nsfwDB = this.shuffleArray(nsfw);

        this.paginatedSfwDB = this.sfwDB.slice(0, this.paginator?.pageSize || this.itemsPerPage);
        this.paginatedNsfwDB = this.nsfwDB.slice(0, this.paginator?.pageSize || this.itemsPerPage);
    }

    ngAfterViewInit(): void {
        if (this.paginator) {
            this.galleryLoaded = true;
        } else {
            setTimeout(() => this.ngAfterViewInit(), 100);
        }
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
        //this.resetImgLoad();
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

        const pageSize = this.nsfwToggle ? this.paginatedSfwDB.length : this.paginatedNsfwDB.length;

        if (this.loadedImages === pageSize || pageSize < 30) {
            // Set a timeout to turn off galleryLoaded after 2 seconds
            setTimeout(() => {
                this.galleryLoaded = false;
            }, 2000);
        }
    }

    resetImgLoad() {
        this.loadedImages = 0;
        this.galleryLoaded = false;
    }

    expandFilter(type) {
        switch (type) {
            case 'member':
                this.showFilterMembers = !this.showFilterMembers;
                this.showFilterTags = false;
                this.showFilterAreas = false;
                break;
            case 'tags':
                this.showFilterTags = !this.showFilterTags;
                this.showFilterMembers = false;
                this.showFilterAreas = false;
                break;
            case 'area':
                this.showFilterAreas = !this.showFilterAreas;
                this.showFilterTags = false;
                this.showFilterMembers = false;
                break;
            default:
                // Handle unexpected types, if needed
                break;
        }
    }

    toggleSelection(item, type) {
        console.log(item, 'item')
        this.filtersActive = true;
        //this.resetImgLoad();
        this.clearAllTags();
        item.selected = !item.selected;

        if (type === 'member') {
            this.sfwFilteredDB = this.filterByMember(this.sfwDB, item.name);
            this.nsfwFilteredDB = this.filterByMember(this.nsfwDB, item.name);
        } else {
            this.sfwFilteredDB = this.filterImages(this.sfwDB, item.name);
            this.nsfwFilteredDB = this.filterImages(this.nsfwDB, item.name);
            console.log(this.sfwFilteredDB)
        }

        this.paginatedSfwDB = this.shuffleArray(this.sfwFilteredDB.slice(0, this.paginator?.pageSize || this.itemsPerPage));
        this.paginatedNsfwDB = this.shuffleArray(this.nsfwFilteredDB.slice(0, this.paginator?.pageSize || this.itemsPerPage));

        if ((this.nsfwToggle ? this.paginatedSfwDB.length : this.paginatedNsfwDB.length) < 30) {
            // Set a timeout to turn on galleryLoaded after 2 seconds
            setTimeout(() => {
                this.galleryLoaded = true;
            }, 2000);
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    filterImages(images: Image[], tagToFind: string): Image[] {
        console.log(tagToFind, 'tagToFind')
        let foundImages: any = [];
        images.map((image) => {
            image.tags.map((tag) => {
                if (this.formatKey(tagToFind.trim()) === this.formatKey(tag.trim())) {
                    foundImages.push(image)
                }
            });
        });

        return foundImages;
    }

    filterByMember(images: Image[], memberName: string): Image[] {
        return images.filter((image) => image.name.toLowerCase() === memberName.toLowerCase());
    }

    formatKey(input: string): string {
        // Replace spaces with underscores and convert to lowercase
        return input.replace(/\s+/g, '_').toLowerCase();
    }

    clearFilterData() {
        //this.resetImgLoad();
        this.filtersActive = false;
        this.showFilterMembers = true;
        this.showFilterTags = false;
        this.showFilterAreas = false;
        this.sfwFilteredDB.length = 0;
        this.nsfwFilteredDB.length = 0;
        this.clearAllTags();

        this.paginatedSfwDB = this.sfwDB.slice(0, this.paginator?.pageSize || this.itemsPerPage);
        this.paginatedNsfwDB = this.nsfwDB.slice(0, this.paginator?.pageSize || this.itemsPerPage);
    }

    deselectOthers(collection, selectedItem) {
        collection.forEach((item) => {
            if (selectedItem !== item) {
                item.selected = false;
            }
        });
    }

    clearAllTags() {
        this.areasObjects.forEach((x) => x.selected = false);
        this.membersExt.forEach((x) => x.selected = false);
        this.sfwFilters.forEach(tag => tag.selected = false);
    }

    isSelected(tag: any): boolean {
        return tag.selected;
    }

}
