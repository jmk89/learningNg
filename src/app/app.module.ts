import { environment } from './../environments/environment';
import { AuthEffects } from './auth/store/auth.effects';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { StoreModule } from "@ngrx/store"
import * as fromApp from './store/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools'

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
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({logOnly: environment.production}),
    SharedModule, //HeaderComponent is using dropdownDirective, so need to import SharedModule here
    CoreModule //this is providing services now
    
  ],
  bootstrap: [AppComponent],
  // providers: [LoggingService]
})
export class AppModule { }
