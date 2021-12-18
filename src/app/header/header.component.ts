import { User } from './../auth/user.model';
import { DataStorageService } from './../services/data-storage.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(
    private dataStorageService: DataStorageService, 
    private authService: AuthService, 
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    //this.userSub = this.authService.user
    this.userSub = this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.isAuthenticated = !!user; // note this is equal to !user ? false : true; 
      });
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    //note that we don't actually care about subscribing to the fetchRecipes here
    //it's done because subscribe was taken out of the fetchRecipes so that
    //recipesResolverService could subscribe
    //we are subscribing here just to satisfy observables
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  toggleDarkTheme(): void {
    document.body.classList.toggle('dark-theme');
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
