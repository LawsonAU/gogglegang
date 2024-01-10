import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, startWith, switchMap, } from 'rxjs/operators';
import { default as itemsDB } from '../../assets/items.final.json';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from '../auth.service';
import { LoginService } from '../login/login.service';

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
    @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger;

    currentRoute: string = "";

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private loginService: LoginService
    ) { }

    get isAuthenticated(): boolean {
        return this.authService.isAuthenticated;
    }

    get isServer(): boolean {
        return this.authService.isServer;
    }

    mainDB: any;

    menuTopLeftPosition: any = { x: 0, y: 0 };

    myControl = new FormControl<string | Item>('');
    options: Item[] = itemsDB;
    filteredOptions: Observable<Item[]>;

    menuItems = [
        {
            name: 'Members',
            route: '/',
            dropdown: true
        },
        {
            name: 'Gallery',
            route: '/gallery',
            dropdown: false
        },
        {
            name: 'I want Art',
            route: '/art',
            dropdown: false
        },
        {
            name: 'Lore',
            route: '/lore',
            dropdown: false
        }
    ]

    members = [
        {
            name: 'All Members',
            route: '/',
            icon: '../../assets/images/NW-bug.svg'
        },
        {
            name: 'Shadres',
            route: '/detail/shadres',
            icon: '../../assets/images/role-icons/archer.png'

        },
        {
            name: 'Cxbby',
            route: '/detail/cxbby',
            icon: '../../assets/images/role-icons/healer.png'

        },
        {
            name: 'Edubbay',
            route: '/detail/edubbay',
            icon: '../../assets/images/role-icons/Gunner.png'

        },
        {
            name: 'Freezingtemps',
            route: '/detail/freezingtemps',
            icon: '../../assets/images/role-icons/tank.png'

        },
        {
            name: 'Spooki',
            route: '/detail/spooki',
            icon: '../../assets/images/role-icons/ab-wizard.png'

        },
        {
            name: 'Sedana',
            route: '/detail/sedana',
            icon: '../../assets/images/role-icons/kill-thief.png'

        },
        {
            name: 'Kesther',
            route: '/detail/kesther',
            icon: '../../assets/images/role-icons/magician.png'

        },
        {
            name: 'Yumemii',
            route: '/detail/yumemii',
            icon: '../../assets/images/role-icons/healer.png'

        },
        {
            name: 'Box',
            route: '/detail/box',
            icon: '../../assets/images/role-icons/warrior.png'

        }
    ]

    private filterValueSubject = new BehaviorSubject<string>('');
    private maxItemsToShow = 50;

    ngOnInit() {
        this.currentRoute = this.router.url;

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

    openMenu(evt, name) {
        const mouseX = evt.clientX;
        const mouseY = evt.clientY;

        this.menuTopLeftPosition = { x: mouseX, y: mouseY };
        if (name === 'Members') {
            this.matMenuTrigger.openMenu();
        }
    }

    closeMenu(evt) {
        this.matMenuTrigger.closeMenu();
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

    logout() {
        this.loginService.logout();
    }

    goToDiscord() {
        window.open('https://discord.gg/4rT9khvb7g', '_blank');
    }

}

