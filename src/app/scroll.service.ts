// src/app/services/scroll.service.ts

import { Injectable } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Injectable({
    providedIn: 'root',
})
export class ScrollService {
    scrollTo(elementId: string) {
        const targetElement = document.getElementById(elementId);

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
    }
}
