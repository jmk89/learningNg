import { Action } from "@ngrx/store";
import { Ingredient } from "../shared/ingredient.model";

const initialState = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ]
};

export function shoppingListReducer(state = initialState, action: Action) {
    switch (action.type) {
        case "ADD_INGREDIENT": //ngrx convention to use all uppercase for action types
            return {
                //spread operator to copy the state, because state changes are always immutable
                ...state,
                //new array with old array elements
                ingredients: [...state.ingredients, action]
            };
    }
}