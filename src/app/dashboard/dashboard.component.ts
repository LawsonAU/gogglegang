import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from './dashboard.service';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {
    mainDB: any;

    selectedServerId: number = 9;

    genServerData: any = {};
    competitiveItems: any = [];

    isLoading: boolean = false;

    constructor(
        private http: HttpClient,
        private dashService: DashboardService
    ) { }

    async ngOnInit(): Promise<void> {
        try {
            // Use HttpClient to fetch 'item-mpdbid.json'
            this.mainDB = await this.http.get('assets/items.final.json').toPromise();
        } catch (error) {
            console.error('Error fetching data:', error);
        }

        //this.getData();
    }

    async getData() {

    }

    selectItem(marketId) {

    }
}
