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
    return this.appData?.users || {};
  }

  getEntry(id: number): Entry {
    if (this.appData?.entries) {
      return this.appData?.entries[id];
    }
    console.warn('no entrydata found!');
    return null;
  }

  getEntries(): Entry[] {
    if (this.appData?.entries) {
      return Object.values(this.appData?.entries);
    }
    console.warn('no entrydata found!');
    return [];
  }

  getCategoriesAsMap(): Record<number, Category> {
    return this.appData?.categories || {};
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

  removeEntry(id: number): void {
    delete this.appData.entries[id];
  }

  getEntriesForQuiz(amount: number): Entry[] {
    let entries = this.getEntries();
    // Shuffle
    entries = entries.sort(() => Math.random() - 0.5);
    entries = entries.sort((a, b) => {
      const aValue = a.result && a.result > 7 ? 1 : 0;
      const bValue = b.result && b.result > 7 ? 1 : 0;
      return aValue - bValue;
    });
    entries = entries.slice(0, amount);
    // Shuffle again
    return entries.sort(() => Math.random() - 0.5);
  }
}

export interface AppDataDao {
  users: Record<number, User>;
  token: string;
  currentUser: number;
  entries: Record<number, Entry>;
  categories: Record<number, Category>;
}
