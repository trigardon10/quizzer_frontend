import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Category } from 'src/app/entry/entities/Category';
import { HttpService } from '../../http.service';
import { SessionService } from '../../session.service';
import { EditEntryComponent } from '../edit-entry/edit-entry.component';

@Component({
  selector: 'app-edit-categories',
  templateUrl: './edit-categories.component.html',
  styleUrls: ['./edit-categories.component.scss'],
})
export class EditCategoriesComponent implements OnInit {
  categories: Category[];
  selected: Category;
  saveInProgress = false;

  newName = '';

  entryAmount = 0;

  constructor(
    private dialogRef: MatDialogRef<EditEntryComponent>,
    private session: SessionService,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.categories = this.session.getCategories();
  }

  selChange(category: Category): void {
    this.selected = category;
    this.newName = category?.name || '';
    this.entryAmount = category
      ? this.session.getEntries().filter((e) => e.categoryId === category.id)
          .length
      : 0;
  }

  save(): void {
    this.saveInProgress = true;
    this.http
      .post<Category>(`category`, { name: this.newName })
      .subscribe(
        (cat: Category) => {
          this.session.addCategory(cat);
          this.dialogRef.close();
        },
        (err) => {
          // TODO: Show Error
          this.saveInProgress = false;
          console.error(err);
        }
      );
  }

  edit(): void {
    this.saveInProgress = true;
    this.http
      .post<Category>(`category/${this.selected.id}`, { name: this.newName })
      .subscribe(
        (cat: Category) => {
          this.session.addCategory(cat);
          this.dialogRef.close();
        },
        (err) => {
          // TODO: Show Error
          this.saveInProgress = false;
          console.error(err);
        }
      );
  }

  delete(): void {
    this.saveInProgress = true;
    this.http
      .delete<void>(`category/${this.selected.id}`, { name: this.newName })
      .subscribe(
        () => {
          this.session.removeCategory(this.selected.id);
          this.dialogRef.close();
        },
        (err) => {
          // TODO: Show Error
          this.saveInProgress = false;
          console.error(err);
        }
      );
  }

  close(): void {
    this.dialogRef.close();
  }
}
