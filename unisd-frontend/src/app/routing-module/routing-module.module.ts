import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, ActivatedRouteSnapshot } from '@angular/router';
import { AuthGuard } from '../core/auth.guard';
import { AuthService } from 'src/app/core';

// TEMPLATE APP COMPONENTS

import { BlankComponent } from '../shared/layouts/blank/blank.component';
import { FullComponent } from '../shared/layouts/full/full.component';
import { NotFoundComponentComponent } from './../components/not-found-component/not-found-component.component';
import { LoginActivate } from '../core/login.activate';
import { environment } from 'src/environments/environment';

import { UserComponent } from '../components/user/user.component';
import { UsersComponent } from '../components/user/users.component';
import { RoleComponent } from '../components/user/role.component';
import { RolesComponent } from '../components/user/roles.component';
import { PermissionComponent } from '../components/user/permission.component';
import { PermissionsComponent } from '../components/user/permissions.component';

import { NgxPermissionsGuard } from 'ngx-permissions';
import { PersoneinterneTitulus } from '../pages/personeinterne-titulus.component';
import { StruttureInterneTitulus } from '../pages/struttureinterne-titulus.component';
import { StruttureEsterneTitulus } from '../pages/struttureesterne-titulus.component';
import { DocumentiTitulus } from '../pages/documenti-titulus.component';
import { MappingRuoli } from '../components/mappingruoli/mappingruoli.component';
import { MappingRuolo } from '../components/mappingruoli/mappingruolo.component';
import { SystemErrorComponent } from '../shared/system-error-component/system-error.component';
import { LinkEsterniComponent } from '../components/link-esterni/link-esterni.component';
import { MappingUfficiTitulus } from '../components/mapping/mappinguffici.component';
import { MappingUfficioTitulus } from '../components/mapping/mappingufficio.component';
import { BandoListComponent } from '../components/bando/bando-list.component';
import { BandoComponent } from '../components/bando/bando.component';
import { BandoListDomandaComponent } from '../components/domanda/bando-list-domanda.component';
import { DomandaComponent } from '../components/domanda/domanda.component';
import { DomandaViewComponent } from '../components/domanda/domanda-view.component';
import { DomandeComponent } from '../components/domanda/domande.component';
import { ListaDomandeCommissioneComponent } from '../components/lista-domande-commissione/lista-domande-commissione.component';
import { BandoViewComponent } from '../components/bando/bando-view.component';
import { CandidatiComponent } from '../components/bando/candidati.component';
import { LogAttivitaComponent } from '../components/user/logattivita.component';


const externalLoginUrlProvider = new InjectionToken('externalUrlRedirectResolver');

const routes: Routes = [
  {
    path: '',
    component: BlankComponent
  },

  {
    path: 'externallogin',
    resolve: {
      url: externalLoginUrlProvider,
    },
    canActivate: [externalLoginUrlProvider],
    component: NotFoundComponentComponent,
  },

  {
    path: 'home',
    component: FullComponent,
    canActivate: [LoginActivate],
    children: [
      {
        path: 'dashboard',
        loadChildren: '../dashboards/dashboard.module#DashboardModule'
      },







      // LINK AI DOCUMENTI
      {
        path: 'lineeguida/:val',
        component: LinkEsterniComponent, canActivate: [AuthGuard], pathMatch: 'full',
      },

       // BANDO
      {
        path: 'bandi', component: BandoListComponent, canActivate: [AuthGuard],
        data: {
          title: 'Lista bandi',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista bandi' }
          ]
        }
      },
      {
        path: 'bandi/new', component: BandoComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Nuovo bando',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista bandi', url: '/home/bandi' },
            { title: 'Bando' }
          ]
        }
      },
      {
        path: 'bandi/:id', component: BandoComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Bando',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista bandi', url: '/home/bandi' },
            { title: 'Bando' }
          ]
        }
      },
      {
        path: 'bandi/view/:id', component: BandoViewComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Bando',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista bandi', url: '/home/bandi' },
            { title: 'Bando' }
          ]
        }
      },
      {
        path: 'candidati', component: CandidatiComponent, canActivate: [AuthGuard],
        data: {
          title: 'Lista domande candidati',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista bandi', url: '/home/bandi'}
          ]
        }
      },
      {
        path: 'lista-domande-commissione', component: ListaDomandeCommissioneComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Seleziona bando',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista domande commissione', url: '/home/lista-domande-commissione' },
          ]
        }
      },
      //DOMANDA
      {
        path: 'lista-bandi-domanda', component: BandoListDomandaComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Seleziona bando',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista bandi', url: '/home/lista-bandi-domanda' },
            { title: 'Nuova domanda' }
          ]
        }
      },
      //DOMANDE
      {
        path: 'lista-domande', component: DomandeComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Lista domande',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista domande', url: '/home/lista-domande' },
          ]
        }
      },
      //DOMANDA
      {
        path: 'domanda/view/:id', component: DomandaViewComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Domanda',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista domande', url: '/home/lista-domande' },
            { title: 'Domanda' }
          ]
        }
      },
      {
        path: 'domanda/:id', component: DomandaComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Domanda',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista domande', url: '/home/lista-domande' },
            { title: 'Domanda' }
          ]
        }
      },
      
      // MAPPING RUOLI
      {
        path: 'mappingruoli', component: MappingRuoli, canActivate: [AuthGuard],
        data: {
          title: 'Associazioni ruoli per primo inserimento',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca associazione ruoli' }
          ]
        }
      },
      {
        path: 'mappingruoli/:id', component: MappingRuolo, canActivate: [AuthGuard],
        data: {
          title: 'Associazioni ruoli per primo inserimento',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca associazioni ruoli' }
          ]
        }
      },
      {
        path: 'mappingruoli/new', component: MappingRuolo, canActivate: [AuthGuard],
        data: {
          title: 'Nuova associazione ruolo per primo inserimento',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Nuova associazione ruolo' }
          ]
        }
      },

      {
        path: 'users', component: UsersComponent, canActivate: [AuthGuard],
        data: {
          title: 'Ricerca utenti',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Utenti' }
          ]
        }
      }, // canActivate:[AuthGuard]
      {
        path: 'users/:id', component: UserComponent, canActivate: [AuthGuard],
        data: {
          title: 'Utente',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Utente' }
          ]
        }
      },
      {
        path: 'roles/new', component: RoleComponent, canActivate: [AuthGuard],
        data: {
          title: 'Nuovo ruolo',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Nuovo ruolo' }
          ]
        }
      },
      {
        path: 'roles/:id', component: RoleComponent, canActivate: [AuthGuard],
        data: {
          title: 'Ruolo',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ruolo' }
          ]
        }
      },
      {
        path: 'roles', component: RolesComponent, canActivate: [AuthGuard],
        data: {
          title: 'Ricerca ruoli',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca ruoli' }
          ]
        }
      },
      {
        path: 'permissions/new', component: PermissionComponent, canActivate: [AuthGuard],
        data: {
          title: 'Nuovo permesso',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Nuovo permesso' }
          ]
        }
      },
      {
        path: 'permissions/:id', component: PermissionComponent, canActivate: [AuthGuard],
        data: {
          title: 'Permesso',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Permesso' }
          ]
        }
      },
      {
        path: 'permissions', component: PermissionsComponent, canActivate: [AuthGuard],
        data: {
          title: 'Ricerca permessi',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca permessi' }
          ]
        }
      },
      { 
        path: 'logattivita',  component: LogAttivitaComponent,  canActivate:[AuthGuard], 
        data: {
          title: 'Log attività',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Log attività' }
          ]
        }
      },

      {
        path: 'personeinterne', component: PersoneinterneTitulus, canActivate: [AuthGuard],
        data: {
          title: 'Ricerca persone interne',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca persone interne' }
          ]
        }
      },
      {
        path: 'struttureinterne', component: StruttureInterneTitulus, canActivate: [AuthGuard],
        data: {
          title: 'Ricerca strutture interne',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca strutture interne' }
          ]
        }
      },
      {
        path: 'struttureesterne', component: StruttureEsterneTitulus, canActivate: [AuthGuard],
        data: {
          title: 'Ricerca strutture esterne',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca strutture esterne' }
          ]
        }
      },
      {
        path: 'documenti', component: DocumentiTitulus, canActivate: [AuthGuard],
        data: {
          title: 'Ricerca documenti',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca documenti' }
          ]
        }
      },
      {
        path: 'mappinguffici', component: MappingUfficiTitulus, canActivate: [AuthGuard],
        data: {
          title: 'Mapping uffici',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca associazione uffici' }
          ]
        }
      },
      {
        path: 'mappinguffici/:id', component: MappingUfficioTitulus, canActivate: [AuthGuard],
        data: {
          title: 'Mapping uffici',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca mapping uffici' }
          ]
        }
      },
      {
        path: 'mappinguffici/new', component: MappingUfficioTitulus, canActivate: [AuthGuard],
        data: {
          title: 'Nuova associazione uffici',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Nuova associazione uffici' }
          ]
        }
      },

    ]
  },
  { path: 'error', component: SystemErrorComponent },
  {
    path: '**',
    component: NotFoundComponentComponent
  }

];

@NgModule({
  providers: [
    {
      provide: externalLoginUrlProvider,
      useValue: (route: ActivatedRouteSnapshot) => {
        // const externalUrl = route.paramMap.get('externalUrl');
        window.open(environment.API_URL + 'api/loginSaml', '_self');
      },
    },
  ],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})

export class RoutingModuleModule { }
