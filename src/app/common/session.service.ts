import { Injectable } from '@angular/core';
import { User } from '../user/entity/User';
import { USERROLE } from '../user/entity/UserRole';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private appData: AppDataDao;

  constructor() {}

  setAppData(appData: AppDataDao): void {
    this.appData = appData;
  }

  getToken(): string {
    return this.appData?.token;
  }

  getUsers(): User[] {
    return Object.values(this.appData?.users);
  }

  getCurrentUser(): User {
    return this.appData?.users[this.appData.currentUser];
  }

  getDefaultRoute(): string {
    const currentUser = this.getCurrentUser();
    return currentUser.role === USERROLE.ADMIN ? 'app/users' : 'app/entries';
  }

  addUser(user: User): void {
    this.appData.users[user.id] = user;
  }
}

export interface AppDataDao {
  users: Record<number, User>;
  token: string;
  currentUser: number;
}
