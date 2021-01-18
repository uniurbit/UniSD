import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { DashboardRoutes } from './dashboard.routing';
import { InfocardComponent } from './dashboard-components/info-card/info-card.component';
import { DashboardService } from './dashboard.service';
import { LoadingModule } from 'ngx-loading';
import { NotificationsComponent } from './dashboard-components/notifications/notifications.component';
import { SharedModule } from '../shared';
import { TableTypeComponent } from '../shared/dynamic-form/table-type.component';
import { NotificationService } from './notification.service';
import { DashboardUffDocentiComponent } from './dashboard-uff-docenti/dashboard-uff-docenti.component';
import { DashboardDocentiComponent } from './dashboard-docenti/dashboard-docenti.component';
import { DomandaresultComponent } from './dashboard-components/domandaresult/domandaresult.component';
import { BandoresultComponent } from './dashboard-components/bandoresult/bandoresult.component';
import { DomandaService } from '../services/domanda.service';
import { BandoService } from '../services/bando.service';
import { DashboardCommissioneComponent } from './dashboard-commissione/dashboard-commissione.component';
import { DomandaCommissioneService } from '../services/domandacommissione.service';
import { BandoCommissioneService } from '../services/bandocommissione.service';
import { DomandacommissioneresultComponent } from './dashboard-components/domandaresult/domandacommissioneresult.component';
import { BandoCommissioneResultComponent } from './dashboard-components/bandoresult/bandocommissioneresult.component';
import { IntestazioneComponent } from '../components/intestazione/intestazione.component';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    LoadingModule,
    RouterModule.forChild(DashboardRoutes),
    PerfectScrollbarModule,
    NgxDatatableModule,
    SharedModule.forRoot(),
  ],
  declarations: [
    InfocardComponent,
    NotificationsComponent,
    DashboardUffDocentiComponent,
    DashboardDocentiComponent,
    DomandaresultComponent,
    BandoresultComponent,
    DomandacommissioneresultComponent,
    BandoCommissioneResultComponent,
    DashboardCommissioneComponent
  ],
  providers: [
    DashboardService,
    NotificationService,
    DatePipe,
    DomandaService,
    BandoService,
    BandoCommissioneService,
    DomandaCommissioneService
  ]
})
export class DashboardModule {}
