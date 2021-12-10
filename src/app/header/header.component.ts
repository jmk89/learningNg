import { DataStorageService } from './../services/data-storage.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userSub = this.authService.user
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
