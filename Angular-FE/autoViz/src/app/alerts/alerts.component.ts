import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { AlertsService } from '../services/alerts.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Module } from 'ag-grid-community';
import { AutoVizComponent } from '../result-dialog/auto-viz/auto-viz.component';


@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [AgGridAngular,MatDialogModule,MatButtonModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent {
  private alertsService = inject(AlertsService);
    alerts: any[] = [];
    rowData : any = [];
    private dialog = inject(MatDialog);
  
    constructor(){
      this.fetchRawAlerts();
    }
  
    columnDefs : any = [
      { field: 'timestamp', headerName : "Timestamp" },
      { field: 'app', headerName : "Application" },
      { field: 'message_metadata_name', headerName: "Alert Name" },
      { field: 'severity_name', headerName : "Severity" },
      { field: 'category_name', headerName : "Category" },
      { field: 'acknowledged', headerName : "Status",valueGetter: (params : any) => params.data.acknowledged ? 'Acknowledged' : 'Unacknowledged' },
      { field: 'site_name', headerName : "Site" },
      { field: 'source.source_name', headerName : "Source Name" },
    ];
  
    fetchRawAlerts() {
      this.alertsService.getRawAlerts().subscribe((data)=>{
        this.alerts = data.data;
        this.rowData = this.alerts;
      })
    }
  
    openAutoVizDialog() {
      this.dialog.open(AutoVizComponent, {
        width: '90vw',
        height: '80vh',
        maxWidth: 'none',
        panelClass: 'full-width-dialog',
        data: { param: 'alerts' }
      });
    }
  
    modules: Module[] = [ClientSideRowModelModule];
}