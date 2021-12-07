import { DataStorageService } from './../services/data-storage.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private dataStorageService: DataStorageService) { }

  ngOnInit(): void {
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

  toggleDarkTheme(): void {
    document.body.classList.toggle('dark-theme');
  }

}
