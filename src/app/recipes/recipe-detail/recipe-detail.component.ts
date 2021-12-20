import { DeleteIngredient } from './../../shopping-list/store/shopping-list.actions';
import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { RecipeService } from 'src/app/services/recipe.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map, switchMap } from 'rxjs/operators';
import * as RecipesActions from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.route.params.pipe(map(params => {
      return +params['id'];
    }), switchMap(id => {
      this.id = id;
      return this.store.select('recipes');
    }), map(recipesState => {
      return recipesState.recipes.find((recipe, index) => {
        return index === this.id;
      });
    })).subscribe(recipe => {
      this.recipe = recipe;
    });
  }

  sendIngredientsToShoppingList() {
    //this is technically fine, but will emit an event for every ingredient added
    //for larger apps, you don't necessarily want to emit a bunch of events, it could be overwhelming
    // this.recipe.ingredients.map((ingredient: Ingredient) => {
    //   this.shoppingListService.addIngredient(ingredient);
    // });

    //instead, we add a function to add all ingredients, and utilize the spread operator ("...") 
    //in the addAll function
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients)
  }

  onEdit() {
    this.router.navigate(['edit'], {relativeTo: this.route, queryParamsHandling: 'preserve'})
  }

  onDeleteRecipe() {
    //this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }

}
