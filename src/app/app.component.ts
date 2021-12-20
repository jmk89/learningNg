import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from './auth/auth.service';
import { LoggingService } from './logging.service';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ng4-complete-guide';
  currentPage = "";

  constructor(private store: Store<fromApp.AppState>, private loggingService: LoggingService) {}

  ngOnInit() {
    this.store.dispatch(new AuthActions.AutoLogin());
    this.loggingService.printLog("Hello from AppComponent ngOnInit");
  }

  changePage(pageName: string) {
    //relic from earlier implementation
    // this.currentPage = pageName;
    // console.log(this.currentPage)
  }
}
