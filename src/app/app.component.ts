import { Component } from '@angular/core';
import { MainService } from './main.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {
    title = 'new-world';

    constructor (
        private mainService: MainService
    ) { }

    ngOnInit() {
        this.mainService.setDefaultTheme();
    }
}
