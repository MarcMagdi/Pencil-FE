import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Pencil';
  loaded$: Observable<any>;

  constructor(public authService: AuthService) {
    this.loaded$ = this.authService.loaded$;
  }
}
