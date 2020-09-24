import { Injectable } from '@angular/core';
import { Category } from '../entry/entities/Category';
import { Entry } from '../entry/entities/Entry';
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

  hasData(): boolean {
    return !!this.appData;
  }

  getToken(): string {
    return this.appData?.token;
  }

  getUsers(): User[] {
    if (this.appData?.users) {
      return Object.values(this.appData?.users);
    }
    console.warn('no userdata found!');
    return [];
  }

  getUsersAsMap(): Record<number, User> {
    return this.appData?.users || {}
  }

  getEntries(): Entry[] {
    if (this.appData?.entries) {
      return Object.values(this.appData?.entries);
    }
    console.warn('no entrydata found!');
    return [];
  }

  getCategoriesAsMap(): Record<number, Category> {
    return this.appData?.categories || {}
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

  removeUser(id: number): void {
    delete this.appData.users[id];
  }

  addEntry(entry: Entry): void {
    this.appData.entries[entry.id] = entry;
  }
}

export interface AppDataDao {
  users: Record<number, User>;
  token: string;
  currentUser: number;
  entries: Record<number, Entry>;
  categories: Record<number, Category>;
}
