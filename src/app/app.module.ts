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
import { AuthModule } from './auth/auth.module';
import { LoggingService } from './logging.service';
import { StoreModule } from "@ngrx/store"
import { shoppingListReducer } from './shopping-list/store/shopping-list.reducer';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule, //should only be imported in app module, just once
    //AuthModule,
    //ShoppingListModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule, //HeaderComponent is using dropdownDirective, so need to import SharedModule here
    CoreModule, //this is providing services now
    StoreModule.forRoot({shoppingList: shoppingListReducer})
  ],
  bootstrap: [AppComponent],
  // providers: [LoggingService]
})
export class AppModule { }
