import { RecipeService } from 'src/app/services/recipe.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Recipe } from '../recipes/recipe.model';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {

    constructor(
        private http: HttpClient, 
        private recipeService: RecipeService,
        private authService: AuthService) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        //http put command - overwrites whatever is already there with what we are sending
        this.http.put("https://ng-course-recipe-book-6c863-default-rtdb.firebaseio.com/recipes.json", recipes)
            .subscribe(response => {
                console.log(response);
            });
    }

    fetchRecipes() {
        
        //don't need an ongoing subscription, only need a single initial subscription
        //rather than submitting, getting the emitted data, and then unsubscribing,
        //we do like this, only Take 1 value from the observable and then auto unsubscribe
        //useful when you only need the user data without caring about user login/logout/etc

        //exhaust map waits for first observable, user observable, to complete.
        //thereafter, it replaces the user observable with the inner observable within
        //the exhaustMap operator
        return this.authService.user.pipe(
            take(1), 
            exhaustMap(user => {
                //now the entire observable switches to this Http observable
                return this.http.get<Recipe[]>(
                    //the user token is passed as a query param
                    //could append in url, however we have optional parameter to http.get methoc 
                    //which we pass some Http Params
                    "https://ng-course-recipe-book-6c863-default-rtdb.firebaseio.com/recipes.json",
                    {
                        params: new HttpParams().set('auth', user.token)
                    }
                );
            }), 
            map(recipes => {
                return recipes.map(recipe => {
                    return {
                        ...recipe, 
                        ingredients: recipe.ingredients ? recipe.ingredients : []
                    };
                });
            }),
            tap(recipes => {
                this.recipeService.setRecipes(recipes);
            })
        );
    }

}