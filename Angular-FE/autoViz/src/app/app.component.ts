import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AlertsComponent } from './alerts/alerts.component';
import { ClientsComponent } from './clients/clients.component';
import { DevicesComponent } from './devices/devices.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatTabsModule, AlertsComponent, ClientsComponent, DevicesComponent],
  template: `
    <mat-tab-group>
      <mat-tab label="Alerts">
        <app-alerts></app-alerts>
      </mat-tab>
      <mat-tab label="Devices">
        <app-devices></app-devices>
      </mat-tab>
      <mat-tab label="Clients">
        <app-clients></app-clients>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [`
    mat-tab-group {
      margin: 20px;
    }
  `]
})
export class AppComponent {}
