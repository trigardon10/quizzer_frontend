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
  currentUser: User;
  displayedColumns: string[] = ['name', 'role', 'delete'];
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<User>;

  constructor(
    private http: HttpService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.sessionService.getCurrentUser();
    this.users = this.sessionService.getUsers();
    this.dataSource = new MatTableDataSource(this.users);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data, headerId) => {
      if (headerId === 'name') {
        return data.name.toLocaleLowerCase().trim();
      }
      return data[headerId];
    };
  }

  getRoleName(role: USERROLE): string {
    let rolename: string;

    switch (role) {
      case USERROLE.ADMIN:
        rolename = 'Administrator';
        break;
      case USERROLE.TEACHER:
        rolename = 'Lehrer';
        break;
      default:
        rolename = 'Schüler';
        break;
    }

    return rolename;
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
        this.dataSource.data = this.users;
        this.table.renderRows();
        this.saveInProgress = false;
      },
      (err) => {
        // TODO: Show Error
        this.saveInProgress = false;
        console.error(err);
      }
    );
  }

  deleteUser(id: number): void {
    this.http.delete(`user/${id}`, {}).subscribe(
      () => {
        this.sessionService.removeUser(id);
        this.users = this.sessionService.getUsers();
        this.dataSource.data = this.users;
        this.table.renderRows();
      },
      (err) => {
        // TODO: Show Error
        console.error(err);
      }
    );
  }
}
