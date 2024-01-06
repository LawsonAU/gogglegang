import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { default as itemsDB } from '../../assets/items.final.json';
import { DashboardService } from '../dashboard/dashboard.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItemComponent } from './select-item/select-item.component';
import { MatDialog } from '@angular/material/dialog';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { CraftCalculatorService } from './craft-calculator.service';

export class DetailExample {
    item_name: string;
    item_id: number;
    price_datetime: string;
    graph_data: GraphData[];
    detail_view: DetailView[];
    lowest_price: string;
}

export class GraphData {
    qty: number | null;
    avail: number;
    date_only: string;
    price_date: string;
    lowest_price: number;
    highest_buy_order: number | null;
    single_price_avail: number;
    avg_price: number;
    avg_avail: number;
    rolling_average: number;
}

export class DetailView {
    qty: number | null;
    avail: number;
    price: number;
    datetime: string;
    buy_order_price: number | null;
}

@Component({
    selector: 'app-calculator',
    templateUrl: './calculator.component.html',
    styleUrls: ['./calculator.component.scss'],
})

export class CalculatorComponent implements OnInit {
    @ViewChild('chartContainer') chartContainer: any;
    treeControl = new NestedTreeControl<any>(node => node.children);
    dataSource = new MatTreeNestedDataSource<any>();

    craftableHlvl = [
        {
            "id": "958613355",
            "name": "Cinnabar"
        },
        {
            "id": "-1144608033",
            "name": "Tolvium"
        },
        {
            "id": "-466139607",
            "name": "Scarhide"
        },
        {
            "id": "-529823600",
            "name": "Smolderhide"
        },
        {
            "id": "-286988992",
            "name": "Blisterweave"
        },
        {
            "id": "-487823190",
            "name": "Scalecloth"
        },
        {
            "id": "-224365773",
            "name": "Barbvine"
        },
        {
            "id": "2125484851",
            "name": "Wildwood"
        }
    ];

    convertMaterials = [,
        {
            "id": "-696253408",
            "name": "Masterwork Material Converter"
        }
    ];

    genMaterials = [
        {
            "id": "-782420613",
            "name": "Sandpaper"
        },
        {
            "id": "-1142154506",
            "name": "Flux"
        },
        {
            "id": "-187775155",
            "name": "Tannin"
        },
        {
            "id": "512733304",
            "name": "Solvent"
        },
        {
            "id": "-1095838984",
            "name": "Cloth Weave",
        }
    ];

    craftingBonus = [
        {
            "name": "Charcoal",
            "bonusMulti": 1.2,
            "id": "454486394",
            "marketId": 615
        },
        {
            "name": "Timber",
            "bonusMulti": 1.2,
            "id": "1149283746",
            "marketId": 93
        },
        {
            "name": "Lumber",
            "bonusMulti": 1.93,
            "id": "1724708",
            "marketId": 235
        },
        {
            "name": "Wyrdwood Planks",
            "bonusMulti": 1.4,
            "id": "-1834317581",
            "marketId": 164
        },
        {
            "name": "Ironwood Planks",
            "bonusMulti": 1.13,
            "id": "1411503823",
            "marketId": 800
        },
        {
            "name": "Iron Ingot",
            "bonusMulti": 1.2,
            "id": "-1133497175",
            "marketId": 120,
        },
        {
            "name": "Steel Ingot",
            "bonusMulti": 1.93,
            "id": "-910165593",
            "marketId": 41
        },
        {
            "name": "Starmetal Ingot",
            "bonusMulti": 1.4,
            "id": "-966061223",
            "marketId": 27,
        },
        {
            "name": "Orichalcum Ingot",
            "bonusMulti": 1.13,
            "id": "-1880821004",
            "marketId": 429
        },
        {
            "name": "Coarse Leather",
            "bonusMulti": 1.2,
            "id": "-2096451509",
            "marketId": 1166
        },
        {
            "name": "Rugged Leather",
            "bonusMulti": 1.93,
            "id": "1493697593",
            "marketId": 904
        },
        {
            "name": "Layered Leather",
            "bonusMulti": 1.4,
            "id": "-68744737",
            "marketId": 163
        },
        {
            "name": "Infused Leather",
            "bonusMulti": 1.13,
            "id": "1301069480",
            "marketId": 572
        },
        {
            "name": "Linen",
            "bonusMulti": 1.2,
            "id": "1203287806",
            "marketId": 868
        },
        {
            "name": "Sateen",
            "bonusMulti": 1.93,
            "id": "-1552285017",
            "marketId": 1355
        },
        {
            "name": "Silk",
            "bonusMulti": 1.4,
            "id": "1741600817",
            "marketId": 249
        },
        {
            "name": "Infused Silk",
            "bonusMulti": 1.13,
            "id": "-2038649974",
            "marketId": 1040
        }
    ];

    chart: any;

    chartOptions = {
        animationEnabled: true,
        theme: 'dark1',
        title: {
            text: 'Sale Data',
        },
        axisX: {
            valueFormatString: 'D MMM',
        },
        axisY: {
            title: '#',
        },
        toolTip: {
            shared: true,
        },
        legend: {
            cursor: 'pointer',
            itemclick: function (e: any) {
                if (
                    typeof e.dataSeries.visible === 'undefined' ||
                    e.dataSeries.visible
                ) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                e.chart.render();
            },
        },
        data: [],
    };

    marketDetail

    constructor(
        private route: ActivatedRoute,
        private dashService: DashboardService,
        private formBuilder: FormBuilder,
        private dialog: MatDialog,
        private craftCalculatorService: CraftCalculatorService
    ) { }

    selectedServerId: number = 9;

    itemId: string = null;
    selectedItem: any = null;
    selectedItemData: any = null;
    graphPrice: any = [];
    graphBo: any = [];
    graphCMA: any = [];
    graphAvail: any = [];

    craftReqSum: any = [];
    craftItemFull: any = [];

    mainDB: any[] = itemsDB;

    isLoading: boolean = false;
    loadGraph: boolean = false;
    loadIngData: boolean = false;
    loadFullData: boolean = false;
    loadReqSum: boolean = false;
    craftHighLvl: boolean = false;
    convertMaterial: boolean = false;
    calculateLoad: boolean = false;
    showCalcData: boolean = false;

    singleCraftCost: number = 0;
    singleCraftProfit: number = 0;
    allCraftCost: number = 0;
    allCraftProfit: number = 0;

    craftDetails: FormGroup;
    craftBreakdown: FormGroup;

    get craftControls() { return this.craftDetails.controls; };
    get craftValues() { return this.craftDetails.value; };

    get breakdownControls() { return this.craftBreakdown.controls; };
    get breakdownValues() { return this.craftBreakdown.value; };

    async ngOnInit() {
        this.route.params.subscribe(async (params) => {
            this.itemId = params['id'];
            console.log(this.itemId);
            console.log(this.mainDB, 'mainDB');
        });

        this.initForms();
        this.getData();
    }

    initForms() {
        this.craftDetails = this.formBuilder.group({
            amount: ['1', [Validators.required]],
            investmentGold: ['0', [Validators.required]],
            gearBonus: [0, [Validators.required]],
            craftHighLvl: false,
            convertMaterial: false,
        });
    }

    getData() {
        this.isLoading = true;
        this.loadReqSum = true;
        this.loadFullData = true;
        this.dashService.getitemInfoAlt(this.selectedServerId, this.itemId).subscribe((res: any) => {
            console.log(res, 'selectedItemData');
            this.selectedItemData = res;

            this.selectedItem = this.mainDB.find((x) => x.marketId == +this.itemId);
            this.selectedItem['marketDetail'] = res;

            let detailLength = this.selectedItemData.detail_view.length;
            this.selectedItem['singlePrice'] = this.selectedItemData.detail_view[detailLength - 1].price

            console.log(this.selectedItem);

            this.loadReqSum = true;
            this.createFullCraftBreakdown();

            this.isLoading = false;
        }, (error) => {
            this.isLoading = false;
        });
    }

    createFullCraftBreakdown() {
        const summaryTemp: any[] = [];
        const addIngredientsRecursively = (itemData, marketId) => {
            const item = this.lookupItemInDb(itemData.id, marketId);
            if (item) {
                let itemBody = {
                    name: item.name,
                    qnty: itemData.quantity,
                    id: item.id,
                    marketId: item.marketId,
                    ingredients: item.ingredients || [],
                }

                summaryTemp.push(itemBody);

                if ((item.ingredients && item.ingredients.length > 0)) {
                    item.ingredients.forEach((ingredient) => {
                        addIngredientsRecursively(ingredient, marketId);
                    });
                } else if (this.genMaterials.some(x => x.id === item.id)) {
                    addIngredientsRecursively(item, marketId);
                }
            }
        };

        for (let i = 0; i < this.selectedItem.ingredients.length; i++) {
            const x = this.selectedItem.ingredients[i];
            addIngredientsRecursively(x, false);
        }

        this.craftReqSum = this.combineAndSumDuplicates(summaryTemp);
        console.log(this.craftReqSum);
        this.getReqSumDataAlt(this.craftReqSum);
    }

    lookupItemInDb(itemId, marketId) {
        var find = null;
        if (marketId) {
            find = this.mainDB.find(x => x.marketId === itemId);
        } else {
            find = this.mainDB.find(x => x.id === itemId);
        }
        return find;
    }

    getReqSumDataAlt(itemIngs: any[]) {
        this.loadIngData = true;
        for (let i = 0; i < itemIngs.length; i++) {
            let itemData = itemIngs[i];

            this.dashService.getitemInfoAlt(this.selectedServerId, itemData.marketId).subscribe((res: any) => {
                itemData['marketDetail'] = res;

                if ((itemIngs.length - 1) === i) {
                    this.loadReqSum = false;

                    if (this.selectedItem) {
                        this.craftItemFull = this.constructCraftingTree(this.selectedItem);
                        console.log(this.craftItemFull, "craftItemFull");
                        this.updateMainIng();
                    } else {
                        console.error(`Item with ID ${this.selectedItem.id} not found.`);
                    }

                    //this.getMultiIngPriceData(this.selectedItem.ingredients);
                }
            }, (error) => {
                let example = new DetailExample();
                itemData['marketDetail'] = example;
                console.log(itemData, 'itemData ALT')

                if ((itemIngs.length - 1) === i) {
                    this.loadReqSum = false;

                    if (this.selectedItem) {
                        this.craftItemFull = this.constructCraftingTree(this.selectedItem);
                        console.log(this.craftItemFull, "craftItemFull");
                        this.updateMainIng();
                    } else {
                        console.error(`Item with ID ${this.selectedItem.id} not found.`);
                    }

                    //this.getMultiIngPriceData(this.selectedItem.ingredients);
                }
            });
        }
    }

    constructCraftingTree(item: any): any {
        //console.log(item);

        let marketData = this.findMarketItem(item);
        //console.log(marketData);

        if (marketData) {
            const craftItem: any = {
                name: item.name,
                quantity: marketData.qnty,
                id: item.id,
                marketId: marketData.marketId,
                marketDetail: marketData.marketDetail,
                detail: this.findCraftItem(item)
            };

            if (item.ingredients && item.ingredients.length > 0) {
                craftItem.ingredients = item.ingredients.map((i: any) => {
                    //console.log(i,'ingredient');
                    const ingredient = this.findCraftItem(i);
                    if (ingredient) {
                        return this.constructCraftingTree(ingredient);
                    } else {
                        //console.log(ingredient, 'ingredient');
                        throw new Error(`Ingredient with ID ${i.id} not found.`);
                    }
                });
            }

            //console.log(craftItem, 'craftItem')
            return craftItem;
        } else {
            const craftItem: any = {
                name: item.name,
                quantity: item.quantity,
                id: item.id,
                marketId: item.marketId,
                marketDetail: item.marketDetail,
                detail: this.findCraftItem(item)
            };

            if (item.ingredients && item.ingredients.length > 0) {
                craftItem.ingredients = item.ingredients.map((i: any) => {
                    const ingredient = this.findCraftItem(i);

                    if (ingredient) {
                        return this.constructCraftingTree(ingredient);
                    } else {
                        throw new Error(`Ingredient with ID ${i.id} not found.`);
                    }
                });
            }

            //console.log(craftItem, 'craftItem')
            return craftItem;
        }
    }

    updateMainIng() {
        this.selectedItem.ingredients.map((x) => {
            let marketData = this.findMarketItem(x);
            if (marketData) {
                x['marketId'] = marketData.marketId;
                x['marketDetail'] = marketData.marketDetail;
            }
        });

        this.finalMath();
        this.loadFullData = false;
    }

    finalMath() {
        //allCraftCost: number = 0;
        //allCraftProfit: number = 0;

        let detailLength = this.craftItemFull.marketDetail.detail_view.length;
        let lowestPrice = this.craftItemFull.marketDetail.detail_view[detailLength - 1].price;
        //let estMainCraft = this.craftItemFull.ingredients[i].marketDetail.detail_view[detailLength - 1].price;

        // Initialize the total cost to 0
        let mainCost = 0;
        let totalCost = 0;
        const ingredients = this.craftItemFull.ingredients;

        // Loop through each ingredient
        for (let i = 0; i < ingredients.length; i++) {
            const ingredient = ingredients[i];
            if (ingredient.marketDetail) {
                // Get the price of the ingredient from the market detail
                const ingredientPrice = ingredient.marketDetail.detail_view[detailLength - 1].price;
                ingredient['singlePrice'] = ingredientPrice;

                // Calculate the cost of this ingredient (price * quantity)
                const ingredientCost = ingredientPrice * ingredient.quantity;

                // Add the ingredient cost to the total cost
                mainCost += ingredientCost;
            }
        }

        let filterIng = JSON.parse(JSON.stringify(this.craftReqSum));
        if (!this.craftHighLvl) {
            filterIng.map((x) => {
                //console.log(x);
                if (x.qnty > 500) {
                    let qnty = JSON.parse(JSON.stringify(x.qnty));
                    x.qnty = qnty - 500
                }
            })
        }

        if (!this.convertMaterial) {
            filterIng = this.craftReqSum.filter(x => x.id != '-696253408');
        }

        console.log(filterIng, 'filterIng');

        // Loop through each ingredient
        for (let i = 0; i < filterIng.length; i++) {
            const totalIngredient = filterIng[i];
            console.log(totalIngredient, 'totalIngredient');
            if (totalIngredient) {
                let ingredientTotalPrice = 0;
                let ingredientTotalCost = 0;
                if (detailLength > 0) {
                    // Get the price of the ingredient from the market detail
                    ingredientTotalPrice = totalIngredient?.marketDetail?.detail_view[detailLength - 1]?.price || 0;
                    //console.log(ingredientTotalPrice);

                    // Calculate the cost of this ingredient (price * quantity)
                    ingredientTotalCost = ingredientTotalPrice * totalIngredient.qnty;
                    //console.log(ingredientTotalCost);
                }

                // Add the ingredient cost to the total cost
                totalCost += ingredientTotalCost;
            }
        }

        this.singleCraftCost = Math.round(mainCost);
        this.singleCraftProfit = Math.round(lowestPrice - mainCost);

        this.allCraftCost = Math.round(totalCost);
        this.allCraftProfit = Math.round(lowestPrice - totalCost);

        // Now totalCost contains the total cost of crafting the item
        console.log("Main Cost:", this.singleCraftCost);
        console.log("Main Profit:", this.singleCraftProfit);
        console.log("Total Cost:", this.allCraftCost);
        console.log("Total Profit:", this.allCraftProfit);
    }

    findCraftItem(id: any): any {
        return this.mainDB.find((item) => item.id == id.id);
    }

    findMarketItem(id: any): any {
        return this.craftReqSum.find((item) => item.marketId == id.marketId);
    }

    combineAndSumDuplicates(items) {
        const combinedItems = {};

        // Iterate through the items array
        items.forEach((item) => {
            const itemId = item.id;

            // If the item already exists in combinedItems, add its quantity
            if (combinedItems[itemId]) {
                combinedItems[itemId].qnty += item.qnty;
            } else {
                // Otherwise, create a new entry
                combinedItems[itemId] = { ...item };
            }
        });

        // Convert the combinedItems object back to an array
        const result = Object.values(combinedItems);

        return result;
    }

    constructGraph() {
        let price = {
            type: 'line',
            showInLegend: true,
            name: 'Price',
            xValueFormatString: 'MMM DD',
            dataPoints: [],
        };

        let bo = {
            type: 'line',
            markerType: 'square',
            showInLegend: true,
            name: 'Buy Order',
            dataPoints: [],
        };

        let cma = {
            type: 'line',
            lineDashType: 'dash',
            showInLegend: true,
            name: 'Cumulative Moving Average',
            dataPoints: [],
        };

        let available = {
            type: 'column',
            markerType: 'square',
            showInLegend: true,
            name: 'Available',
            fillOpacity: 0.5,
            dataPoints: [],
        };

        for (let i = 0; i < this.selectedItemData.length; i++) {
            const x = this.selectedItemData[i];
            console.log(x);

            const lowest_price = {
                x: new Date(x.date_only),
                y: x.lowest_price,
            };
            const highest_buy_order = {
                x: new Date(x.date_only),
                y: x.highest_buy_order,
            };
            const rolling_average = {
                x: new Date(x.date_only),
                y: x.rolling_average,
            };
            const avail = { x: new Date(x.date_only), y: x.avail };

            price.dataPoints.push(lowest_price);
            bo.dataPoints.push(highest_buy_order);
            cma.dataPoints.push(rolling_average);
            available.dataPoints.push(avail);
        }

        this.chartOptions.data.push(price);
        this.chartOptions.data.push(bo);
        this.chartOptions.data.push(cma);
        this.chartOptions.data.push(available);
    }

    addItem() {
        const dialogRef = this.dialog.open(SelectItemComponent, {
            width: "500px",
            data: null,
        });

        dialogRef.afterClosed().subscribe((data) => {
            console.log(data);
            if (data) {

            }
        });
    }


    calculateItem() {
        //this.calculateLoad = false;
        //this.showCalcData = false;
        const optimumQuantity = this.craftCalculatorService.calculateOptimumQuantity(
            +this.craftValues.investmentGold,
            +this.craftValues.gearBonus,
            this.craftItemFull
        );
        console.log(optimumQuantity)

        let amount = +this.craftValues.amount || 1;
        let levelOne: any = [];
    }
}
