import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const ADD_INGREDIENT = "ADD_INGREDIENT"
export const ADD_INGREDIENTS = "ADD_INGREDIENTS"

export class AddIngredient implements Action {
    //must never be changed from outside
    //enhances type safety and protects redux pattern
    readonly type = ADD_INGREDIENT;
    //payload not required by Action interface
    constructor(public payload: Ingredient) {}
}

export class AddIngredients implements Action {
    readonly type = ADD_INGREDIENTS;
    constructor(public payload: Ingredient[]) {}
}

export type ShoppingListActions = AddIngredient | AddIngredients;