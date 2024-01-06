import { Injectable } from '@angular/core';
import { ApiInterfaceService } from '../api-interface.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

    constructor(
        private api: ApiInterfaceService
    ) { }

    async getGeneralServerInfo(serverId) {
		try {
			return this.api.get('server-price-data/' + serverId, '');
		} catch (e) {
			console.log(e);
			throw new Error(e);
		}
    }

    async getitemInfo(selectedServerId, itemId) {
		try {
			return this.api.get('price-data/' + selectedServerId + '/' + itemId, '');
		} catch (e) {
			console.log(e);
			throw new Error(e);
		}
    }

    getitemInfoAlt(selectedServerId, itemId) {
        return this.api.get('price-data/' + selectedServerId + '/' + itemId, '');
    }
}
