import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ClientSideRowModelModule, GridApi } from 'ag-grid-community';
import { ColumnsToolPanelModule } from 'ag-grid-enterprise';
import { ClientsService } from '../services/clients.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AutoVizComponent } from '../result-dialog/auto-viz/auto-viz.component';
@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [AgGridAngular,MatDialogModule,MatButtonModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {

  private clientService = inject(ClientsService);
  clients: any[] = [];
  rowData : any = [];
  private dialog = inject(MatDialog);
  private gridApi!: GridApi;

  constructor(){
    this.fetchRawClients();
  }

  columnDefs : any = [
    { field: 'connection_status', headerName : "Connection Status" },
    { field: 'client_hostname', headerName : "Client Hostname" },
    { field: 'site', headerName: "Site" },
    { field: 'ipv4', headerName : "IPv4" },
    { field: 'operating_system', headerName : "Operating System" },
    { field: 'mac', headerName : "MAC address" },
    { field: 'username', headerName : "Username" },
    { field: 'vlan', headerName : "VLAN" },
    { field: 'switch_name', headerName : "Switch Name"},
  ];

  fetchRawClients() {
    this.clientService.getRawClients().subscribe((data)=>{
      this.clients = data.data;
      this.rowData = this.clients;
    })
  }

  onGridReady(params: any) {
    this.gridApi = params.api; 
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
      data: { param: 'clients',columns : this.getCurrentColumns() }
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
