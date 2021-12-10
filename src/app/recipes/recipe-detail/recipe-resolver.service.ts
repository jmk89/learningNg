import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { RecipeService } from "src/app/services/recipe.service";
import { Recipe } from "../recipe.model";

@Injectable()
export class RecipeResolver implements Resolve<Recipe> {

    constructor(private recipeService: RecipeService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
            : Observable<any>|Promise<any>|any {
        return this.recipeService.getRecipe(+route.params['id']);
    }
    

}