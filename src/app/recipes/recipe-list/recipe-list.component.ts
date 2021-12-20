import {  Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';
import { Router } from '@angular/router';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;

  constructor(private router: Router, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    // this.subscription = this.recipeService.recipesChanged
    this.subscription = this.store.select('recipes')
    .pipe(map(recipesState => recipesState.recipes))
    .subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    });
  }

  onNew() {
    this.router.navigate(['/recipes/new']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
