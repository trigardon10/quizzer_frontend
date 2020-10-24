import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditEntryComponent } from './dialogs/edit-entry/edit-entry.component';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private d: MatDialog) {}

  editEntry(id: number): MatDialogRef<EditEntryComponent> {
    return this.d.open(EditEntryComponent, { data: id });
  }
}
