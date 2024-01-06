import { startWith, switchMap, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { default as itemsDB } from '../../../assets/items.final.json';
import { Router } from '@angular/router';

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
    selector: 'app-select-item',
    templateUrl: './select-item.component.html',
    styleUrls: ['./select-item.component.scss']
})

export class SelectItemComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<SelectItemComponent>,
        private router: Router
    ) { }

    private filterValueSubject = new BehaviorSubject<string>('');
    private maxItemsToShow = 50;

    mainDB: any;

    myControl = new FormControl<string | Item>('');
    options: Item[] = itemsDB;
    filteredOptions: Observable<Item[]>;

    currentRoute: any = null;

    ngOnInit(): void {
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

    onSearchSubmit(event: Event | any) {
        console.log(event, 'event');

        // Prevent the default form submission behavior
        event.preventDefault();

        // Get the selected option from the form control
        const selectedOption = this.myControl.value as Item;

        // Call the common method to handle the selected option
        this.handleSelectedOption(selectedOption);
    }

    onOptionSelected(event: any) {
        // Get the selected option from the event
        const selectedOption = event.option.value as Item;

        // Call the common method to handle the selected option
        this.handleSelectedOption(selectedOption);
    }

    private handleSelectedOption(selectedOption: Item): void {
        if (selectedOption) {
            // Navigate to the 'calculator' route with the selected option's marketId
            this.goToRoute({ route: 'calculator' }, selectedOption.marketId);
        }
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
        this.dialogRef.close();
    }

}
