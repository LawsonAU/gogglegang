import { TestBed } from '@angular/core/testing';

import { CustomSnackBarService } from './snack-bar.service';

describe('SnackBarService', () => {
    let service: CustomSnackBarService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CustomSnackBarService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
