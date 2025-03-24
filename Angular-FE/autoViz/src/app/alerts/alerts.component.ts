import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AlertsService } from '../services/alerts.service';
import { AutoVizComponent } from './auto-viz/auto-viz.component';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatDialogModule, HttpClientModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent {
  displayedColumns: string[] = ['id', 'alert_type', 'severity', 'status'];
  alerts: any[] = [];
  private alertService = inject(AlertsService);
  private dialog = inject(MatDialog);

  constructor() {
    this.fetchRawAlerts();
  }

  fetchRawAlerts() {
    this.alertService.getRawAlerts().subscribe((data) => {
      this.alerts = data.data; // Assuming `data` has a `data` property with alerts
    });
  }

  openAutoVizDialog() {
    this.dialog.open(AutoVizComponent, {
      width: '400px'
    });
  }
}
