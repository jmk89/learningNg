import * as ShoppingListActions from './../shopping-list/store/shopping-list.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Recipe } from "../recipes/recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

@Injectable({providedIn: 'root'})
export class RecipeService {
    public recipeSelected = new Subject<Recipe>();
    recipesChanged = new Subject<Recipe[]>();

    // private recipes: Recipe[] = [
    //     new Recipe(
    //         // 1,
    //         "Classic Marinara", 
    //         "From Dolly Sods", 
    //         "../../../assets/pictures/classicMarinara.jpg", 
    //         [
    //             new Ingredient('Pasta Sauce', 1),
    //             new Ingredient('Noodles', 500)
    //         ]),
    //     new Recipe(
    //         // 2,
    //         "Wacky Marinara", 
    //         "From Dolly Sods", 
    //         "../../../assets/pictures/classicMarinara.jpg", 
    //         [
    //             new Ingredient('Garlic Sauce', 1),
    //             new Ingredient('Bowties', 400)
    //         ])
    // ];

    private recipes: Recipe[] = [];

    constructor(private store: Store<fromShoppingList.AppState>) {}

    getRecipes() {
        //ok so in javascript, returning an Array like this actually returns the reference to the array.
        //So if this returned reference is updated elsewhere, it will update the actual array here as well.
        //we don't want other components modifying this private array accidentally, so it's better to 
        //call slice and return a copy of the array.
        //this is how javascript works. referential.
        return this.recipes.slice();

    }

    getRecipe(index: number) {
        // let recipe = this.recipes.find( (r) => {
        //     return r.id === id
        // });
        // return recipe;
        return this.recipes[index]
    }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe)
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        // commenting service out, now using ngrx
        //this.shoppingListService.addIngredients(ingredients);
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients))
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}