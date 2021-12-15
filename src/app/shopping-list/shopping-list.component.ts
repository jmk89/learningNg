import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from './../services/shopping-list.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(
    private shoppingListService: ShoppingListService, 
    private loggingService: LoggingService,
    private store: Store<{shoppingList: {ingredients: Ingredient[]}}>
  ) { }

  ngOnInit() {
    this.ingredients = this.store.select("shoppingList"); 
    //getting rid of these two parts here, because the ngrx store is
    //going to be how ingredients are accessed
    // this.ingredients = this.shoppingListService.getIngredients();
    // this.subscription = this.shoppingListService.ingredientsChanged
    // .subscribe(
    //   (ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients;
    // });

    this.loggingService.printLog("Hello from ShoppingListComponent ngOnInit");
    
  }

  ngOnDestroy() {
    //this.subscription.unsubscribe();
    //note we don't unsubscribe from the ngrx subscription
    //angular does this for us
  }

  onEditItem(index: number) {
    this.shoppingListService.startedEditing.next(index);
  }

}
