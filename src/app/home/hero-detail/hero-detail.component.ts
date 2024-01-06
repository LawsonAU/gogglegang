import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { memberData } from '../members.data';
import { skinData } from '../skins.data';
import { trigger, style, transition, animate, state } from "@angular/animations";

@Component({
    selector: 'app-hero-detail',
    templateUrl: './hero-detail.component.html',
    styleUrls: ['./hero-detail.component.scss'],
    animations: [
        trigger('fade', [
            transition('void => *', [
                style({ opacity: 0, transform: 'translateY(50px)' }),
                animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                    style({ opacity: 1, transform: 'translateY(0px)' }))
            ])
        ]),
        trigger('fadeStnd', [
            state('void', style({ opacity: 0 })),
            transition('* => *', [
                style({ opacity: 0 }),
                animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                    style({ opacity: 1 })
                )
            ]),
            transition(':leave', [
                animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                    style({ opacity: 0 })
                )
            ])
        ]),
    ]
})

export class HeroDetailComponent implements OnInit {
    members: any = memberData.members;
    skins: any = skinData.skins;

    currentMember: any = null;
    selectedSkin: any = null;

    constructor (
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const paramName = params['name'];
            this.matchSkins();
            this.currentMember = this.members.find(member => member.name.toLowerCase() === paramName.toLowerCase());
            console.log(this.currentMember)

            if (this.currentMember.skins.length > 0) {
                this.selectedSkin = this.currentMember.skins[0];
            }
        });
    }

    removeDuplicates(skins: any[]): any[] {
        const uniqueSkins: { [key: string]: boolean } = {};
        return skins.filter(skin => {
            const isDuplicate = uniqueSkins.hasOwnProperty(skin.fileName);
            uniqueSkins[skin.fileName] = true;
            return !isDuplicate;
        });
    }

    matchSkins() {
        // Iterate through each member in memberData
        this.members.forEach((member) => {
            let uniqueSkins: any = [];

            member.skins = [];

            // Iterate through each skin group in skinData
            this.skins.forEach((skinGroup) => {
                // Iterate through each skin in the skinGroup
                skinGroup.forEach((skin) => {
                    // Check if the member's name matches the skin's name
                    if (member.name === skin.name) {
                        // Add the skin to the member's skins array
                        if (!member.skins) {
                        }
                        uniqueSkins.push(skin);
                        //member.skins.push(skin);
                    }
                });
            });

            member.skins = this.removeDuplicates(uniqueSkins);
        });



        console.log(this.members)
    }

    selectSkin(skin) {
        this.selectedSkin = skin;
    }
}
