import { Ingredient } from "src/app/shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

export interface AppState {
    shoppingList: State;
}

export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

const initialState: State = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ],
    editedIngredient: null,
    editedIngredientIndex: -1
};

export function shoppingListReducer(
    state: State = initialState, 
    action: ShoppingListActions.ShoppingListActions
) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT: //ngrx convention to use all uppercase for action types
            return {
                //spread operator to copy the state, because state changes are always immutable
                ...state,
                //new array with old array elements
                ingredients: [...state.ingredients, action.payload]
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            };
        case ShoppingListActions.UPDATE_INGREDIENT:
            //notice how things are getting copied to new objects
            //this follows the redux pattern of immutable objects
            //don't update existing, create copies and update those copies
            //then update the store with new state
            const ingredient = state.ingredients[action.payload.index]
            const updatedIngredient = {
                ...ingredient,
                ...action.payload.ingredient
            };
            const updatedIngredients = [...state.ingredients]
            updatedIngredients[action.payload.index] = updatedIngredient;
            return {
                ...state,
                ingredients: updatedIngredients
            };
        case ShoppingListActions.DELETE_INGREDIENT:
            
            return {
                ...state,
                //filter is vanilla js
                ingredients: state.ingredients.filter((ingredient, index) => {
                    //return false to filter out
                    //return true to keep item
                    return index !== action.payload; 
                })
            };
        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredientIndex: action.payload,
                //uses the spread operator here to copy the ingredients array
                //in the store. Don't want to actually return the store array
                editedIngredient: {...state.ingredients[action.payload]}
            };
        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredientIndex: null,
                editedIngredient: -1
            };
        default:
            return state;
    }
}