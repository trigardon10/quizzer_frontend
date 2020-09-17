import { Component, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';
import { Router } from '@angular/router';
import { SessionService, AppDataDao } from '../common/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  loginInProgress = false;

  constructor(
    private http: HttpService,
    private router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {}

  login(): void {
    this.loginInProgress = true;
    this.http
      .post('login', {
        username: this.username,
        password: this.password,
      })
      .subscribe(
        (appData: AppDataDao) => {
          this.sessionService.setAppData(appData);
          this.router.navigate([this.sessionService.getDefaultRoute()]);
          this.loginInProgress = false;
        },
        (err) => {
          // TODO: Show Error
          console.error(err);
          this.loginInProgress = false;
        }
      );
  }
}
