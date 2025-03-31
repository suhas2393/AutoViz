import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ClientSideRowModelModule, GridApi } from 'ag-grid-community';
import { ColumnsToolPanelModule } from 'ag-grid-enterprise';
import { DevicesService } from '../services/devices.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Module } from 'ag-grid-community';
import { AutoVizComponent } from '../result-dialog/auto-viz/auto-viz.component';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [AgGridAngular,MatDialogModule,MatButtonModule],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss'
})
export class DevicesComponent {
  private devicesService = inject(DevicesService);
    devices: any[] = [];
    rowData : any = [];
    private dialog = inject(MatDialog);
    private gridApi!: GridApi;
  
    constructor(){
      this.fetchRawDevices();
    }

    columnDefs : any = [
      { field: 'connected', headerName : "Connection Status" ,valueGetter: (params : any) => params.data.connected ? 'Connected' : 'Disconnected',},
      { field: 'hostname', headerName : "Device Hostname" },
      { field: 'locations.site', headerName: "Site" },
      { field: 'healthy_clients', headerName: "Healthy Clients" },
      { field: 'unhealthy_clients', headerName : "Unhealthy Clients" },
      { field: 'software_version', headerName : "Software version" },
      { field: 'mac_address', headerName : "MAC address" },
      { field: 'serial_number', headerName : "Serial Number" },
      { field: 'device_ip', headerName : "IP address" },
      { field: 'product_type', headerName : "Product Type"},
      { field: 'managed_by', headerName : "Managed By"},
      { field: 'device_category', headerName : "Device Category"},
    ];
  
    fetchRawDevices() {
      this.devicesService.getRawDevices().subscribe((data)=>{
        this.devices = data.data;
        this.rowData = this.devices;
      })
    }

    onGridReady(params: any) {
      this.gridApi = params.api;
      this.gridApi.closeToolPanel();
    }
  
    getCurrentColumns(){
      const allColumns = this.gridApi.getAllDisplayedColumnGroups();
      if (allColumns) {
        const columnData = allColumns.map((column : any) => (column.getColId()));
        return columnData;
      } else {
        return [];
      }
    }
  
    openAutoVizDialog() {
      this.dialog.open(AutoVizComponent, {
        width: '90vw',
        height: '80vh',
        maxWidth: 'none',
        panelClass: 'full-width-dialog',
        data: { param: 'devices',columns : this.getCurrentColumns() }
      });
    }
  
    modules: any[] = [ClientSideRowModelModule,ColumnsToolPanelModule];

    sideBar = {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
        }
      ],
      defaultToolPanel: ''
    };
}
