import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';
import { ErrorPageComponent } from './error-page/error-page.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full'},
    {
        path:'auth',
        loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule)
    },
    { 
        path: 'recipes', 
        loadChildren: () => import('./recipes/recipes.module').then(module => module.RecipesModule) 
    },
    {
        path: 'shopping-list',
        loadChildren: () => import('./shopping-list/shopping-list.module').then(module => module.ShoppingListModule)
    },
    { path: 'not-found', component: ErrorPageComponent, data: {message: 'Page not found...'} },
    { path: '**', redirectTo: '/not-found' }
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
    
}