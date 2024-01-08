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
        this.isLoading = true;
        let token$ = await this.dashService.getGeneralServerInfo(this.selectedServerId);
        this.genServerData = await lastValueFrom(token$);
        //console.log(this.genServerData, 'genServerData');

        let compTemp = this.genServerData.most_listed;
        compTemp.map((x) => {
            let body = {
                name: x[0],
                priceAlt: x[1],
                id: x[2],
                image: null,
                itemType: null,
                tradeSkill: null,
                tier: null
            }

            let lookup = this.mainDB.find(y => y.marketId == x[2]);
            if (lookup) {
                body.image = lookup.imageUrl;
                body.itemType = lookup.itemType;
                body.tradeSkill = lookup.tradeSkill;
                body.tier = lookup.tier;
            } else {
                body.image = null;
            }
            this.competitiveItems.push(body);
        });
        this.competitiveItems.length = 8;
        console.log(this.competitiveItems, 'competitiveItems');
        this.isLoading = false;
    }

    selectItem(marketId) {

    }
}
