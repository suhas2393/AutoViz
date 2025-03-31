import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { ClientsService } from '../../services/clients.service';
import { AlertsService } from '../../services/alerts.service';
import { DevicesService } from '../../services/devices.service';

@Component({
  selector: 'app-autoviz-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatCardModule, HighchartsChartModule],
  templateUrl: './auto-viz.component.html',
  styleUrls: ['./auto-viz.component.scss']
})
export class AutoVizComponent {
  Highcharts: typeof Highcharts = Highcharts;
  analyzedData: any = null;
  analyzedInsights : any = null;
  loading = true;
  insightsList: string[] = [];
  showInsights = false;

  private dialogRef = inject(MatDialogRef<AutoVizComponent>);
  private clientsService = inject(ClientsService);
  private alertsService = inject(AlertsService);
  private devicesService = inject(DevicesService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.param === 'clients'){
      this.fetchAnalyzedClients(data.columns);
    }
    else if (data.param === 'alerts') {
      this.fetchAnalyzedAlerts(data.columns)
    }
    else{
      this.fetchAnalyzedDevices(data.columns)
    }
  }

  fetchAnalyzedClients(columnsData : any) {
    this.clientsService.getAnalyzedClients(columnsData).subscribe(
      (data) => {
        this.analyzedData = data.highcharts_config;
        this.analyzedInsights = data.insights;
        this.loading = false;
      },
      () => this.loading = false
    );
  }

  fetchAnalyzedAlerts(columnsData : any) {
    this.alertsService.getAnalyzedAlerts(columnsData).subscribe(
      (data) => {
        this.analyzedData = data.highcharts_config;
        this.analyzedInsights = data.insights;
        this.loading = false;
      },
      () => this.loading = false
    );
  }

  fetchAnalyzedDevices(columnsData : any) {
    this.devicesService.getAnalyzedDevices(columnsData).subscribe(
      (data) => {
        this.analyzedData = data.highcharts_config;
        this.analyzedInsights = data.insights;
        this.loading = false;
      },
      () => this.loading = false
    );
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  toggleInsights() {
    this.showInsights = !this.showInsights;
    this.insightsList = Object.values(this.analyzedInsights);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
