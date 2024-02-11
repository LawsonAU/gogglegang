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
}
