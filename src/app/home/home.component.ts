import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { trigger, state, style, transition, animate, query, stagger } from "@angular/animations";
import { memberData } from './members.data';
import { MatTab } from '@angular/material/tabs';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    animations: [
        trigger("showHideFilter", [
            state("collapsed", style({ height: "0px", overflow: "hidden" })),
            state("expanded", style({ height: "*" })),
            transition(
                "expanded <=> collapsed",
                animate("350ms cubic-bezier(0.4, 0.0, 0.2, 1)")
            ),
        ]),
        trigger("showHideSearch", [
            state("collapsed", style({ width: "0px", overflow: "hidden", opacity: 0 })),
            state("expanded", style({ width: "*", opacity: 1 })),
            transition(
                "expanded <=> collapsed",
                animate("350ms cubic-bezier(0.4, 0.0, 0.2, 1)")
            ),
        ]),
        trigger('fadeStagger', [
            transition('* => *', [
                query(':enter', [
                    style({ opacity: 0, transform: 'translateY(25px)', }),
                    stagger(100, [
                        animate('250ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0px)' }))
                    ])
                ], { optional: true })
            ])
        ]),
        trigger('fade', [
            transition('void => *', [
                style({ opacity: 0, transform: 'translateY(25px)' }),
                animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                    style({ opacity: 1, transform: 'translateY(0px)' }))
            ])
        ]),
    ],
})

export class HomeComponent implements OnInit, AfterViewInit {
    @ViewChildren(MatTab) tabs: QueryList<MatTab>;
    @ViewChild('myVideo', { static: true }) myVideo: ElementRef;
    members: any = memberData.members;

    uniqueWeapons: any = [];
    filteredMembers: any = [];
    selectedWeapons: string[] = [];

    showHideSearch: boolean = false;

    selectedKillStealLevel: any = null;

    ngOnInit(): void {
        this.initFilter();
        this.filteredMembers = this.members;
        this.changeVideoSource('../../assets/videos/gg-background-vid2.webm');
    }

    ngAfterViewInit(): void {
        this.myVideo.nativeElement.addEventListener('loadedmetadata', () => {
            console.log('Video is loaded');
            // You can check if the video is playing here, and load/play if needed
            if (this.myVideo.nativeElement.paused) {
                this.loadAndPlayVideo();
            }
        });

        this.myVideo.nativeElement.addEventListener('play', () => {
            console.log('Video is playing');
        });
    }

    showSearchBar() {
        this.showHideSearch = !this.showHideSearch;
    }

    loadAndPlayVideo() {
        this.myVideo.nativeElement.load();
        this.myVideo.nativeElement.play();
    }

    changeVideoSource(newSource: string) {
        this.myVideo.nativeElement.src = newSource;
        this.myVideo.nativeElement.load(); // Reloads the video element
        this.myVideo.nativeElement.play();
    }

    initFilter() {
        // Extract unique weapons
        this.members.forEach(member => {
            member.weapon.forEach(weapon => {
                const existingWeapon = this.uniqueWeapons.find(w => w.weapon === weapon);

                if (!existingWeapon) {
                    this.uniqueWeapons.push({ weapon: weapon, selected: false });
                }
            });
        });
    }

    updateFilter(weapon: string): void {
        console.log(weapon);

        const selectedWeapon = this.uniqueWeapons.find(w => w.weapon === weapon);

        if (selectedWeapon) {
            // Toggle the selected state
            selectedWeapon.selected = !selectedWeapon.selected;

            // Filter members based on selected weapons
            this.selectedWeapons = this.uniqueWeapons
                .filter(w => w.selected)
                .map(w => w.weapon);
        }
    }

    isMemberVisible(member: any): boolean {
        // If no weapons are selected, show all members
        if (this.selectedWeapons.length === 0) {
            return true;
        }

        // Check if at least one selected weapon matches the member's weapons
        return member.weapon.some(w => this.selectedWeapons.includes(w));
    }

    tabChanged(event: number): void {
        // Access the selected MatTab using the index
        const selectedTab: MatTab = this.tabs.toArray()[event];
        console.log(selectedTab)

        if (selectedTab.textLabel != 'All') {
            this.filterMembersByWeapon(selectedTab.textLabel);
        } else {
            this.filteredMembers = this.members;
        }
    }

    filterMembersByWeapon(weapon: string): void {
        this.filteredMembers = this.members.filter(member => member.weapon.includes(weapon));
    }

    // Function to filter members by KSLevel
    filterMembersByKSLevel(ksLevel: number): void {
        this.filteredMembers = this.members.filter(member => member.KSLevel === ksLevel);
    }

    onKillStealLevelChange(evt) {
        if (evt) {
            this.filterMembersByKSLevel(evt)
        } else {
            this.clearSelection();
        }
    }

    clearSelection() {
        this.filteredMembers = this.members;
        this.selectedKillStealLevel = null;
    }

    filterMembers(searchTerm: string): void {
        if (searchTerm.trim() === '') {
            this.filteredMembers = this.members;
            return;
        }

        // Use the filter method to find matching members based on the name
        this.filteredMembers = this.members.filter(member =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
}
