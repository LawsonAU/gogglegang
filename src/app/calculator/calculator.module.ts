
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalculatorRoutingModule } from './calculator-routing.module';
import { CalculatorComponent } from './calculator.component';
import { SharedModule } from '../shared/shared.module';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectItemComponent } from './select-item/select-item.component';

@NgModule({
    declarations: [CalculatorComponent, SelectItemComponent],
    imports: [
        CommonModule,
        CalculatorRoutingModule,
        SharedModule,
        CanvasJSAngularChartsModule,
        FormsModule,
        ReactiveFormsModule
    ],
})

export class CalculatorModule {}
