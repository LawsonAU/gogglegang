import { Injectable } from '@angular/core';

interface Ingredient {
    marketId: number;
    name: string;
    quantity: number;
    singlePrice?: number;
    detail?: {
        qtyBonus: number;
    };
    ingredients?: Ingredient[];
}

@Injectable({
    providedIn: 'root'
})

export class CraftCalculatorService {

    constructor() { }

    findMarketItem(id: any): number {
        // Implement this method to fetch the price of a single item from the market
        // Replace this with your actual implementation or API call
        return 10.0; // Placeholder value, replace with actual logic
    }

    calculateOptimumQuantity(currencyToInvest: number, fixedBonus: number, craftingData: Ingredient): number {
        this.populateSinglePrices(craftingData);

        const adjustedQuantity = this.calculateAdjustedQuantity(craftingData, fixedBonus);
        const totalCost = adjustedQuantity * craftingData.singlePrice;
        const optimumQuantity = Math.floor(currencyToInvest / craftingData.singlePrice);

        return Math.min(adjustedQuantity, optimumQuantity);
    }

    private populateSinglePrices(ingredient: Ingredient) {
        if (ingredient.singlePrice === undefined) {
            ingredient.singlePrice = this.findMarketItem(ingredient.marketId);
        }

        if (ingredient.ingredients) {
            for (const subIngredient of ingredient.ingredients) {
                this.populateSinglePrices(subIngredient);
            }
        }
    }

    private calculateAdjustedQuantity(ingredient: Ingredient, fixedBonus: number): number {
        let adjustedQuantity = ingredient.quantity * (1 + fixedBonus);

        if (ingredient.detail && ingredient.detail.qtyBonus !== undefined) {
            adjustedQuantity *= (1 + ingredient.detail.qtyBonus);
        }

        if (ingredient.ingredients) {
            for (const subIngredient of ingredient.ingredients) {
                adjustedQuantity += this.calculateAdjustedQuantity(subIngredient, fixedBonus);
            }
        }

        return adjustedQuantity;
    }
}
