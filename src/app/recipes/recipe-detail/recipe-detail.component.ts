import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { RecipeService } from 'src/app/services/recipe.service';

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
    private router: Router) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.recipe = this.recipeService.getRecipe(this.id);
        }
      );
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
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes'])
  }

}
