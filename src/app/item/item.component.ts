import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class ItemComponent {
    @Input() item: any; // Use a proper type for your item data

    form: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            name: [''], // Initialize with default values
            quantity: [''],
            id: [''],
            marketId: [''],
            marketDetail: [''],
            detail: [''],
            singlePrice: [''],
            ingredients: this.formBuilder.array([]) // Initialize an empty FormArray
        });
    }
}
