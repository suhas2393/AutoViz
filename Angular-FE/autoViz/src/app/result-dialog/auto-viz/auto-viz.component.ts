import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { ClientsService } from '../../services/clients.service';

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

  constructor() {
    this.fetchAnalyzedClients();
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

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
