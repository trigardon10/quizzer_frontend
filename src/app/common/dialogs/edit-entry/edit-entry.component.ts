import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from 'src/app/entry/entities/Category';
import { Entry } from 'src/app/entry/entities/Entry';
import { HttpService } from '../../http.service';
import { SessionService } from '../../session.service';

@Component({
  selector: 'app-edit-entry',
  templateUrl: './edit-entry.component.html',
  styleUrls: ['./edit-entry.component.scss'],
})
export class EditEntryComponent implements OnInit {
  entry: Entry;

  saveInProgress = false;
  categories: Category[];

  category: Category;

  constructor(
    private dialogRef: MatDialogRef<EditEntryComponent>,
    @Inject(MAT_DIALOG_DATA) private id: number,
    private session: SessionService,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.entry = { ...this.session.getEntry(this.id) };
    delete this.entry.id;
    delete this.entry.creatorId;
    delete this.entry.result;
    this.categories = this.session.getCategories();
    this.category =
      typeof this.entry.categoryId === 'number'
        ? this.session.getCategory(this.entry.categoryId)
        : null;
  }

  catChange(category: Category): void {
    this.category = category;
    this.entry.categoryId = category ? category.id : null;
  }

  saveEntry(): void {
    this.saveInProgress = true;
    this.http.post<Entry>(`entry/${this.id}`, this.entry).subscribe(
      (entry: Entry) => {
        this.dialogRef.close(entry);
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
