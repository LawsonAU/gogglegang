import { Component, OnInit } from '@angular/core';
import { ScrollService } from '../scroll.service';
import { trigger, style, transition, animate } from "@angular/animations";

@Component({
    selector: 'app-art',
    templateUrl: './art.component.html',
    styleUrls: ['./art.component.scss'],
    animations: [
        trigger('fade', [
            transition('void => *', [
                style({ opacity: 0, transform: 'translateY(50px)' }),
                animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                    style({ opacity: 1, transform: 'translateY(0px)' }))
            ])
        ]),
        trigger('fade150ms', [
            transition('void => *', [
                style({ opacity: 0, transform: 'translateY(50px)' }),
                animate('400ms 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                    style({ opacity: 1, transform: 'translateY(0px)' }))
            ])
        ]),
        trigger('fade300ms', [
            transition('void => *', [
                style({ opacity: 0, transform: 'translateY(50px)' }),
                animate('400ms 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                    style({ opacity: 1, transform: 'translateY(0px)' }))
            ])
        ])
    ]
})

export class ArtComponent implements OnInit {

    constructor(private scrollService: ScrollService) { }

    inGame: boolean = false;

    paymentOptions: any = [
        {
            name: "Basic",
            price: {
                base: "$5",
                tooltip: "In-Game Currency - New World - Server: Delos",
                gold: "2k Gold"
            },
            point1: {
                text: "High Quality Render",
                tooltip: ""
            },
            point2: {
                text: "Res: 1024x1536 || 2730x1536",
                tooltip: "Depending on Phone or tablet"
            },
            point3: {
                text: "Image &/or simple prompt",
                tooltip: "Can include magic e.g. Fire Mage, also provide details like hair/eye color"
            },
            point4: {
                text: "No Weapons/Hyper complicated Armor",
                tooltip: ""
            },
            example: {
                link: "basic",
                text: "See examples"
            },
            cta: {
                link: "https://discord.gg/4rT9khvb7g",
                text: "Discord"
            }
        },
        {
            name: "Pro",
            price: {
                base: "$20",
                tooltip: "In-Game Currency - New World - Server: Delos",
                gold: "10k Gold"
            },
            point1: {
                text: "UHQ</span> Render + Hand drawn",
                tooltip: "Ultra-High Quality with manual hand drawing for greater control and detail"
            },
            point2: {
                text: "Up to 5600x3584",
                tooltip: "Depending on Phone or tablet"
            },
            point3: {
                text: "Image &/or simple prompt",
                tooltip: "Can include magic e.g. Fire Mage, also provide details like hair/eye color"
            },
            point4: {
                text: "Anything goes within reason",
                tooltip: ""
            },
            example: {
                link: "pro",
                text: "See examples"
            },
            cta: {
                link: "https://discord.gg/4rT9khvb7g",
                text: "Discord"
            }
        },
        {
            name: "Custom",
            price: {
                base: "TBD",
                tooltip: "Join discord and message us your request",
                gold: "TBD"
            },
            point1: {
                text: "Need something Special?",
                tooltip: ""
            },
            point2: {
                text: "Contact us",
                tooltip: ""
            },
            point3: {
                text: "-",
                tooltip: ""
            },
            point4: {
                text: "-",
                tooltip: ""
            },
            example: {
                link: "basic",
                text: ""
            },
            cta: {
                link: "https://discord.gg/4rT9khvb7g",
                text: "Discord"
            }
        }
    ]

    ngOnInit(): void {

    }

    scrollToElement(elementId: string) {
        this.scrollService.scrollTo(elementId);
    }
}
