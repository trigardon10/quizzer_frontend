import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { HttpService } from '../common/http.service';
import { SessionService } from '../common/session.service';
import { DialogService } from '../common/dialog.service';
import { User } from '../user/entity/User';
import { Entry } from './entities/Entry';
import { Category } from './entities/Category';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class EntryComponent implements OnInit, AfterViewInit {
  saveInProgress = false;

  entries: Entry[];
  categories: Record<number, Category>;
  users: Record<number, User>;
  currentUser: User;
  displayedColumns: string[] = [
    'question',
    'creator',
    'category',
    'result',
    'edit',
    'delete',
  ];
  dataSource: MatTableDataSource<Entry>;
  expandedElement: any = null;

  newEntry = {
    question: '',
    hint: '',
    answer: '',
  };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<User>;

  constructor(
    private http: HttpService,
    private sessionService: SessionService,
    private dialog: DialogService
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
        return data.categoryId
          ? this.categories[data.categoryId].name.toLocaleLowerCase().trim()
          : '';
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

  editEntry(id: number): void {
    this.dialog
      .editEntry(id)
      .afterClosed()
      .subscribe(
        (entry) => {
          if (entry) {
            this.sessionService.addEntry(entry);
            this.entries = this.sessionService.getEntries();
            this.dataSource.data = this.entries;
            this.table.renderRows();
          }
        },
        (err) => {
          // TODO: Show Error
          console.error(err);
        }
      );
  }

  deleteEntry(id: number): void {
    this.http.delete(`entry/${id}`, {}).subscribe(
      () => {
        this.sessionService.removeEntry(id);
        this.entries = this.sessionService.getEntries();
        this.dataSource.data = this.entries;
        this.table.renderRows();
      },
      (err) => {
        // TODO: Show Error
        console.error(err);
      }
    );
  }

  editCategories(): void {
    this.dialog
      .editCategories()
      .afterClosed()
      .subscribe(
        (entry) => {
          if (entry) {
            this.entries = this.sessionService.getEntries();
            this.dataSource.data = this.entries;
            this.table.renderRows();
          }
        },
        (err) => {
          // TODO: Show Error
          console.error(err);
        }
      );
  }
}
