import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Recipe } from "../recipes/recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from './shopping-list.service';

@Injectable({providedIn: 'root'})
export class RecipeService {
    public recipeSelected = new Subject<Recipe>();
    recipesChanged = new Subject<Recipe[]>();

    private recipes: Recipe[] = [
        new Recipe(
            // 1,
            "Classic Marinara", 
            "From Dolly Sods", 
            "../../../assets/pictures/classicMarinara.jpg", 
            [
                new Ingredient('Pasta Sauce', 1),
                new Ingredient('Noodles', 500)
            ]),
        new Recipe(
            // 2,
            "Wacky Marinara", 
            "From Dolly Sods", 
            "../../../assets/pictures/classicMarinara.jpg", 
            [
                new Ingredient('Garlic Sauce', 1),
                new Ingredient('Bowties', 400)
            ])
    ];

    constructor(private shoppingListService: ShoppingListService) {}

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
        this.shoppingListService.addIngredients(ingredients);
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}