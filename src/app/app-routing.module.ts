import { AuthComponent } from './auth/auth.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';
import { ErrorPageComponent } from './error-page/error-page.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full'},
    { path: 'shopping-list', component: ShoppingListComponent },
    { path: 'auth', component: AuthComponent},
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