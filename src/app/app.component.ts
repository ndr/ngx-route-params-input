import { Component } from '@angular/core';
import { users } from './users-db';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public users = users;
}
