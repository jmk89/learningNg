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
    //note that we don't subscribe to the fetchRecipes here
    //the Header component shouldn't care about recipes loading
    this.dataStorageService.fetchRecipes();
  }

  toggleDarkTheme(): void {
    document.body.classList.toggle('dark-theme');
  }

}
