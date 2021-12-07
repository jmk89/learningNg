import { RecipeService } from 'src/app/services/recipe.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class DataStorageService {

    constructor(private http: HttpClient, private recipeService: RecipeService) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        //http put command - overwrites whatever is already there with what we are sending
        this.http.put("https://ng-course-recipe-book-6c863-default-rtdb.firebaseio.com/recipes.json", recipes)
            .subscribe(response => {
                console.log(response);
            })
    }

}