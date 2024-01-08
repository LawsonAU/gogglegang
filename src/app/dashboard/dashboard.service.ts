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
            const result = await this.api.getNoKey('api/server-price-data/' + serverId, '');
            return result;
        } catch (e) {
            console.error('Error in getGeneralServerInfo:', e);
            throw e; // Re-throw the caught error
        }
    }


    async getitemInfo(selectedServerId, itemId) {
		try {
			return this.api.getNoKey('api/price-data/' + selectedServerId + '/' + itemId, '');
		} catch (e) {
			console.log(e);
			throw new Error(e);
		}
    }

    getitemInfoAlt(selectedServerId, itemId) {
        return this.api.getNoKey('api/price-data/' + selectedServerId + '/' + itemId, '');
    }
}
