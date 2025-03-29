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
  loading = true;

  private dialogRef = inject(MatDialogRef<AutoVizComponent>);
  private clientsService = inject(ClientsService);
  private alertsService = inject(AlertsService);
  private devicesService = inject(DevicesService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.param === 'clients'){
      this.fetchAnalyzedClients();
    }
    else if (data.param === 'alerts') {
      this.fetchAnalyzedAlerts()
    }
    else{
      this.fetchAnalyzedDevices()
    }
  }

  fetchAnalyzedClients() {
    this.clientsService.getAnalyzedClients().subscribe(
      (data) => {
        this.analyzedData = data.highcharts_config;
        this.loading = false;
      },
      () => this.loading = false
    );
  }

  fetchAnalyzedAlerts() {
    this.alertsService.getAnalyzedAlerts().subscribe(
      (data) => {
        this.analyzedData = data.highcharts_config;
        this.loading = false;
      },
      () => this.loading = false
    );
  }

  fetchAnalyzedDevices() {
    this.devicesService.getAnalyzedDevices().subscribe(
      (data) => {
        this.analyzedData = data.highcharts_config;
        this.loading = false;
      },
      () => this.loading = false
    );
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
