import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng4-complete-guide';
  currentPage = "";

  changePage(pageName: string) {
    //relic from earlier implementation
    // this.currentPage = pageName;
    // console.log(this.currentPage)
  }
}
