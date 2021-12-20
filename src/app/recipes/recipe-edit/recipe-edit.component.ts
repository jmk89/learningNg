import { RecipeService } from 'src/app/services/recipe.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeEditValidators } from './recipe-edit-validators';
import { Recipe } from '../recipe.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  ingredients: string[];

  constructor(
    private route: ActivatedRoute, 
    private recipeService: RecipeService, 
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      )
  }

  initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      //const recipe = this.recipeService.getRecipe(this.id);
      this.store.select('recipes').pipe(map(recipeState => {
        return recipeState.recipes.find((recipe,index) => {
          return index === this.id;
        })
      })).subscribe(recipe => {
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;
        if (recipe['ingredients']) {
          for (let ingredient of recipe.ingredients) {
            recipeIngredients.push(new FormGroup({
              'name': new FormControl(ingredient.name, [Validators.required]),
              'amount': new FormControl(ingredient.amount, [
                Validators.required, 
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            }))
          }
        }
      })
    }

    this.recipeForm = new FormGroup({
      'recipeNameTS': new FormControl(recipeName, [Validators.required], RecipeEditValidators.checkForbiddenRecipeName),
      'recipeDetailTS': new FormControl(recipeDescription),
      'recipeImageURLTS': new FormControl(recipeImagePath, [Validators.required]),
      'recipeIngredientsTS': recipeIngredients
    })
  }

  onIngredientAdd() {
    (<FormArray>this.recipeForm.get('recipeIngredientsTS')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required, 
          Validators.pattern("^[1-9]+[0-9]*$")
        ])
      })
    )
  }

  getIngredientControls() {
    return (<FormArray>this.recipeForm.get('recipeIngredientsTS')).controls;
  }

  onSubmit() {
    const newRecipe = new Recipe(
      this.recipeForm.value['recipeNameTS'],
      this.recipeForm.value['recipeDetailTS'],
      this.recipeForm.value['recipeImageURLTS'],
      this.recipeForm.value['recipeIngredientsTS']);
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, newRecipe)
    } else {
      this.recipeService.addRecipe(newRecipe)
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('recipeIngredientsTS')).removeAt(index);
  }

}
