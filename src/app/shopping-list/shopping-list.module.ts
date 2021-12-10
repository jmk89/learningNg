import { ShoppingListRoutingModule } from './shopping-list-routing.module';
import { RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent
    ],
    exports: [
        ShoppingListComponent,
        ShoppingEditComponent
    ],
    imports: [
        RouterModule,
        ReactiveFormsModule,
        SharedModule,
        FormsModule,
        ShoppingListRoutingModule
    ]
})
export class ShoppingListModule {

}