import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayOutletComponent } from './display-outlet/display-outlet.component';
import { MissingComponent } from './missing/missing.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    {
        path: '',
        component: DisplayOutletComponent,
        canActivate: [],
        children: [
            //{ path: '', redirectTo: environment.homeRoute, pathMatch: "full" },
            { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
            { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'calculator', loadChildren: () => import('./calculator/calculator.module').then(m => m.CalculatorModule) },
            { path: 'gallery', loadChildren: () => import('./gallery/gallery.module').then(m => m.GalleryModule) },
            { path: 'lore', loadChildren: () => import('./lore/lore.module').then(m => m.LoreModule) }
        ]
    },
    { path: 'login', component: LoginComponent },
    { path: '404', component: MissingComponent },
    { path: '**', redirectTo: '404' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
