import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { HttpService } from '../common/http.service';
import { SessionService } from '../common/session.service';
import { User } from '../user/entity/User';
import { Entry } from './entities/Entry';
import { Category } from './entities/Category';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {

  saveInProgress = false;

  entries: Entry[];
  categories: Record<number, Category>;
  users: Record<number, User>;
  currentUser: User;
  displayedColumns: string[] = ['question', 'hint', 'answer', 'creator', 'category'];
  dataSource: MatTableDataSource<Entry>;

  newEntry = {
          question: '',
          hint: '',
          answer: '',
        };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<User>;

  constructor(
    private http: HttpService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.entries = this.sessionService.getEntries();
    this.currentUser = this.sessionService.getCurrentUser();
    this.users = this.sessionService.getUsersAsMap();
    this.categories = this.sessionService.getCategoriesAsMap();
    this.dataSource = new MatTableDataSource(this.entries);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data, headerId) => {
      if (headerId === 'creator') {
        return this.users[data.creatorId].name.toLocaleLowerCase().trim();
      } else if (headerId === 'category') {
        return this.categories[data.categoryId].name.toLocaleLowerCase().trim();
      }
      return data[headerId];
    };
  }

  saveEntry(): void {
    this.saveInProgress = true;
    this.http.post<Entry>('entry', this.newEntry).subscribe(
      (entry: Entry) => {
        this.newEntry = {
          question: '',
          hint: '',
          answer: '',
        };
        this.sessionService.addEntry(entry);
        this.entries.unshift(entry);
        this.dataSource.data = this.entries;
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
}
