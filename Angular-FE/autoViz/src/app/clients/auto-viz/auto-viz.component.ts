import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-autoviz-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatCardModule],
  templateUrl: './auto-viz.component.html',
  styleUrls: ['./auto-viz.component.scss']
})
export class AutoVizComponent {
  analyzedData: any = null;
  private dialogRef = inject(MatDialogRef<AutoVizComponent>);
  private clientsService = inject(ClientsService);

  constructor() {
    this.fetchAnalyzedClients();
  }

  fetchAnalyzedClients() {
    this.clientsService.getAnalyzedClients().subscribe((data) => {
      this.analyzedData = data;
    });
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
