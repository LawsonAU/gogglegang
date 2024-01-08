import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate } from "@angular/animations";

@Component({
    selector: 'app-lore',
    templateUrl: './lore.component.html',
    styleUrls: ['./lore.component.scss'],
    animations: [
        trigger('fade', [
            transition('void => *', [
                style({ opacity: 0, transform: 'translateY(50px)' }),
                animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                    style({ opacity: 1, transform: 'translateY(0px)' }))
            ])
        ]),
        trigger('fade300ms', [
            transition('void => *', [
                style({ opacity: 0, transform: 'translateY(25px)' }),
                animate('400ms 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                    style({ opacity: 1, transform: 'translateY(0px)' }))
            ])
        ])
    ]
})

export class LoreComponent implements OnInit {
    ngOnInit(): void {

    }
}
