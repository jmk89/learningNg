import { RecipesModule } from './recipes/recipes.module';
import { AuthComponent } from './auth/auth.component';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule, //should only be imported in app module, just once
    RecipesModule, //note this is imported before AppRouting
    //need to resolve the routes in RecipesModule before AppRouting,
    //otherwise AppRouting Wildcard will go to pageNotFound
    ShoppingListModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule, //HeaderComponent is using dropdownDirective, so need to import SharedModule here
    CoreModule //this is providing services now
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
