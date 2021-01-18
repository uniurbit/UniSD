import { Routes } from '@angular/router';
import { AuthGuard } from '../core/auth.guard';
import { DashboardUffDocentiComponent } from './dashboard-uff-docenti/dashboard-uff-docenti.component';
import { DashboardDocentiComponent } from './dashboard-docenti/dashboard-docenti.component';
import { DashboardCommissioneComponent } from './dashboard-commissione/dashboard-commissione.component';



export const DashboardRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboarduffdocenti',
        component: DashboardUffDocentiComponent,
        canActivate:[AuthGuard],
        data: {
          title: 'Dashboard Ufficio Amm.ne e Reclutamento Personale Docente',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Dashboard Ufficio Amm.ne e Reclutamento Personale Docente' }
          ]
        }
      },     
      {
        path: 'dashboarddocenti',
        component: DashboardDocentiComponent,
        canActivate:[AuthGuard],
        data: {
          title: 'Dashboard Docenti',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Dashboard Docenti' }
          ]
        }
      }, 
      {
        path: 'dashboardcommissione',
        component: DashboardCommissioneComponent,
        canActivate:[AuthGuard],
        data: {
          title: 'Dashboard Commissione',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Dashboard Commissione' }
          ]
        }
      }, 
               
  
    ]
  }
];
