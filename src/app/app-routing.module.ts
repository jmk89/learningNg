import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';
import { ErrorPageComponent } from './error-page/error-page.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full'},
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