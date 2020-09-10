import { Component, OnInit } from '@angular/core';
import { USERROLE } from './entity/UserRole'
import { HttpService } from '../common/http.service'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  roles = USERROLE;

  newUser = {
    username: '',
    password: '',
    role: USERROLE.STUDENT
  }

  saveInProgress = false;

  constructor(private http: HttpService) { }

  ngOnInit(): void {
  }

  saveUser(): void {
    this.saveInProgress = true;
    this.http.post('user', this.newUser).subscribe(() => {
      this.newUser = {
        username: '',
        password: '',
        role: USERROLE.STUDENT
      };
      this.saveInProgress = false;
    },
    (err) => {
      this.saveInProgress = false;
      console.error(err);
    })
  }

}
