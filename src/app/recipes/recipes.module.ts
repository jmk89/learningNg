import { RecipesRoutingModule } from './recipes-routing.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { NgModule } from "@angular/core";
import { RecipesComponent } from './recipes.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        RecipeListComponent,
        RecipeItemComponent,
        RecipeDetailComponent,
        RecipesComponent,
        RecipeEditComponent
    ],
    exports: [ //put the declarations here, so that any module which imports
                //the recipe module can use these components
        RecipeListComponent,
        RecipeItemComponent,
        RecipeDetailComponent,
        RecipesComponent,
        RecipeEditComponent
    ],
    imports: [
        RouterModule, 
        ReactiveFormsModule,
        CommonModule, //used to get access to ngIf and ngFor
        RecipesRoutingModule
    ]
})
export class RecipesModule {

}