import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ng4-complete-guide';
  currentPage = "";

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.autoLogin();
  }

  changePage(pageName: string) {
    //relic from earlier implementation
    // this.currentPage = pageName;
    // console.log(this.currentPage)
  }
}
