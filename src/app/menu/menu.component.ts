import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, startWith, switchMap, } from 'rxjs/operators';
import { default as itemsDB } from '../../assets/items.final.json';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

export interface Item {
    tier?: number;
    name: string;
    imageUrl: string;
    qtyBonus?: number;
    tradeSkill?: string;
    itemType?: string;
    ingredients?: { id: string; name: string; quantity: number }[];
    id: string;
    xp?: number;
    quantity?: number;
    rarity?: number;
    externalUrl?: string;
    marketId: number;
}

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})


export class MenuComponent implements OnInit {

    currentRoute: any = null;

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    mainDB: any;

    myControl = new FormControl<string | Item>('');
    options: Item[] = itemsDB;
    filteredOptions: Observable<Item[]>;

    menuItems = [
        {
            name: 'Home',
            route: '/'
        },
        {
            name: 'Gallery',
            route: '/gallery'
        }
    ]

    private filterValueSubject = new BehaviorSubject<string>('');
    private maxItemsToShow = 50;

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.currentRoute = event.url;
            }
        });

        this.filteredOptions = this.filterValueSubject.pipe(
            startWith(''),
            switchMap((value: any) => {
                const name = typeof value === 'string' ? value : value?.name;
                return this.getFilteredOptions(name);
            })
        );

        this.myControl.valueChanges.subscribe((value: any) => {
            this.filterValueSubject.next(value);
        });
    }

    private getFilteredOptions(name: string): Observable<Item[]> {
        const filterValue = name.toLowerCase();
        return of(this.options)
            .pipe(
                map((options) =>
                    options.filter((option) =>
                        option.name.toLowerCase().includes(filterValue)
                    )
                ),
                map((filteredOptions) =>
                    filteredOptions.slice(0, this.maxItemsToShow)
                )
            );
    }

    displayFn(item: Item): string {
        return item && item.name ? item.name : '';
    }

    private _filter(name: string): Item[] {
        const filterValue = name.toLowerCase();
        return this.options.filter((option) =>
            option.name.toLowerCase().includes(filterValue)
        );
    }

    goToRoute(item, itemId?) {
        console.log(item)
        this.currentRoute = item.route;
        if (itemId) {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate([item.route, itemId]);
            });
        } else {
            this.router.navigate([item.route]);
        }
    }

    onSearchSubmit(event: Event) {
        console.log(event, 'event');
        console.log(this.myControl, 'this.myControl');
        event.preventDefault(); // Prevent the default form submission behavior

        // Get the selected option from the form control
        const selectedOption = this.myControl.value as Item;

        if (selectedOption) {
            // Navigate to the 'calculator' route with the selected option's marketId
            this.goToRoute({ route: 'calculator' }, selectedOption.marketId);
        }
    }
}

