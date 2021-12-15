import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const ADD_INGREDIENT = "ADD_INGREDIENT"

export class AddIngredient implements Action {
    //must never be changed from outside
    //enhances type safety and protects redux pattern
    readonly type = ADD_INGREDIENT;
    //payload not required by Action interface
    payload: Ingredient;
}