import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { USERROLE } from './entity/UserRole';
import { HttpService } from '../common/http.service';
import { SessionService } from '../common/session.service';
import { User } from './entity/User';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, AfterViewInit {
  roles = USERROLE;

  newUser = {
    username: '',
    password: '',
    role: USERROLE.STUDENT,
  };

  saveInProgress = false;

  users: User[];
  displayedColumns: string[] = ['id', 'name', 'role'];
  dataSource: User[] = [{ id: 1, name: 'abc', role: 2 }]; // : MatTableDataSource<User>;

  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<User>;

  constructor(
    private http: HttpService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    // this.users = this.sessionService.getUsers();
    // this.dataSource = new MatTableDataSource(this.users);
  }

  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort;
    this.table.renderRows();
  }

  saveUser(): void {
    this.saveInProgress = true;
    this.http.post<User>('user', this.newUser).subscribe(
      (user: User) => {
        this.newUser = {
          username: '',
          password: '',
          role: USERROLE.STUDENT,
        };
        this.sessionService.addUser(user);
        this.users.unshift(user);
        this.saveInProgress = false;
      },
      (err) => {
        // TODO: Show Error
        this.saveInProgress = false;
        console.error(err);
      }
    );
  }
}
