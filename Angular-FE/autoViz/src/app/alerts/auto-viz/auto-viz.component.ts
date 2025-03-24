import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AlertsService } from '../../services/alerts.service';

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
  private alertService = inject(AlertsService);

  constructor() {
    this.fetchAnalyzedAlerts();
  }

  fetchAnalyzedAlerts() {
    this.alertService.getAnalyzedAlerts().subscribe((data) => {
      this.analyzedData = data;
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
