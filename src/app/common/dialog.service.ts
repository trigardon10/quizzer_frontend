import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditCategoriesComponent } from './dialogs/edit-categories/edit-categories.component';
import { EditEntryComponent } from './dialogs/edit-entry/edit-entry.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private d: MatDialog) {}

  editEntry(id: number): MatDialogRef<EditEntryComponent> {
    return this.d.open(EditEntryComponent, { data: id });
  }

  editCategories(): MatDialogRef<EditCategoriesComponent> {
    return this.d.open(EditCategoriesComponent);
  }
}
