import { AuthService } from './core/auth.service';
import { CommonModule, LOCATION_INITIALIZED, DatePipe } from '@angular/common';
import { RouterModule, Routes, Router } from '@angular/router';
import { RoutingModuleModule } from './routing-module/routing-module.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component, LOCALE_ID, Injector, APP_INITIALIZER } from '@angular/core';
import { HttpModule } from '@angular/http';
import { JwtModule } from '@auth0/angular-jwt';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgbModule, NgbDateParserFormatter, NgbDateAdapter, NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { APP_BASE_HREF } from '@angular/common';

// SERVICES
import { ConfirmationDialogService } from './shared/confirmation-dialog/confirmation-dialog.service';

// LAYOUT
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotFoundComponentComponent } from './components/not-found-component/not-found-component.component';

// COMPONENTS APPLICATION
import { HomeComponent } from './home/home.component';
import { RoleService } from '../app/services/role.service';
import { PermissionService } from '../app/services/permission.service';
import { UnitaOrganizzativaService } from '../app/services/unitaorganizzativa.service';
import { MappingUfficioService } from '../app/services/mappingufficio.service';

// AUTENTICAZIONE
import { UserComponent } from './components/user/user.component';
import { UsersComponent } from './components/user/users.component';
import { PermissionComponent } from './components/user/permission.component';
import { PermissionsComponent } from './components/user/permissions.component';
import { RoleComponent } from './components/user/role.component';
import { RolesComponent } from './components/user/roles.component';

// CORE
import { MessageCacheService } from './core/message.service';
import { AuthGuard } from './core/auth.guard';
import { CoreModule } from './core/core.module';
import { LoginActivate } from './core/login.activate';
import { HttpInterceptorProviders, GlobalErrorHandlerProviders } from './core/index';
import { RequestCache, RequestCacheWithMap } from './core/request-cache.service';

import { UserService } from './services/user.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule, HttpLoaderFactory } from './shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ToastrModule } from 'ngx-toastr';

import { LoadingModule } from 'ngx-loading';

import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { MessageService } from './shared';

// PIPE
import { MycurrencyPipe } from './shared/pipe/custom.currencypipe';
import { UniqueName } from './shared/pipe/unique-name';
import { UniqueYear } from './shared/pipe/unique-year';

import { NgSelectModule } from '@ng-select/ng-select';

import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
// import { ApplicationService } from './application/application.service';

import { StorageServiceModule } from 'ngx-webstorage-service';
import { TranslateModule, TranslateLoader, TranslateService, MissingTranslationHandler } from '@ngx-translate/core';
import { PersonaInternaService } from './services/personainterna.service';
import { StrutturaInternaService } from './services/strutturainterna.service';
import { StrutturaEsternaService } from './services/strutturaesterna.service';
import { DocumentoService } from './services/documento.service';
import { DocumentiTitulus } from './pages/documenti-titulus.component';
import { StruttureEsterneTitulus } from './pages/struttureesterne-titulus.component';
import { StruttureInterneTitulus } from './pages/struttureinterne-titulus.component';
import { PersoneinterneTitulus } from './pages/personeinterne-titulus.component';
import { MappingRuolo } from './components/mappingruoli/mappingruolo.component';
import { MappingRuoli } from './components/mappingruoli/mappingruoli.component';
import { MappingRuoloService } from './services/mappingruolo.service';

import { NgbStringAdapter } from './NgbStringAdapter';
import { NgbDateCustomParserFormatter } from './NgbDateCustomParserFormatter';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { LinkEsterniComponent } from './components/link-esterni/link-esterni.component';
import { InputConfirmationDialogComponent } from './shared/input-confirmation-dialog/input-confirmation-dialog.component';
import { MappingUfficioTitulus } from './components/mapping/mappingufficio.component';
import { MappingUfficiTitulus } from './components/mapping/mappinguffici.component';
import { MyMissingTranslationHandler } from './shared/MyMissingTranslationHandler';
import { BandoComponent } from './components/bando/bando.component';
import { BandoListComponent } from './components/bando/bando-list.component';
import { DomandaViewComponent } from './components/domanda/domanda-view.component';
import { BandoListDomandaComponent } from './components/domanda/bando-list-domanda.component';
import { DomandaComponent } from './components/domanda/domanda.component';
import { SalvaAnnullaButtonComponent } from './components/salva-annulla-button/salva-annulla-button.component';
import { IntestazioneComponent } from './components/intestazione/intestazione.component';
import { DomandeComponent } from './components/domanda/domande.component';
import { ListaDomandeCommissioneComponent } from './components/lista-domande-commissione/lista-domande-commissione.component';
import { BandoViewComponent } from './components/bando/bando-view.component';
import { CandidatiComponent } from './components/bando/candidati.component';
import { MyFilterhourPipe } from './components/bando/filterhour.pipe';
import { LogAttivitaComponent } from './components/user/logattivita.component';
import { LogAttivitaService } from './services/logattivita.service';





const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 1,
  wheelPropagation: true,
  minScrollbarLength: 20
};


export function tokenGetter() {
  return localStorage.getItem(AuthService.TOKEN);
}

registerLocaleData(localeIt);

export function appInitializerFactory(translate: TranslateService, injector: Injector) {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      const langToSet = 'it';
      translate.setDefaultLang('it');
      translate.use(langToSet).subscribe(() => {
        // tslint:disable-next-line:no-console
        console.info(`Successfully initialized '${langToSet}' language.'`);
      }, err => {
        console.error(`Problem with '${langToSet}' language initialization.'`);
      }, () => {
        resolve(null);
      });
    });
  });
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    
    HomeComponent,

    NotFoundComponentComponent,

    UserComponent,
    UsersComponent,
    PermissionComponent,
    PermissionsComponent,
    RoleComponent,
    RolesComponent,
    MappingRuolo,
    MappingRuoli,

    PersoneinterneTitulus,
    StruttureEsterneTitulus,
    StruttureInterneTitulus,
    DocumentiTitulus,
   
    LinkEsterniComponent,  
    MappingUfficiTitulus,
    MappingUfficioTitulus,
    BandoComponent,
    BandoListComponent,
    BandoListDomandaComponent,
    DomandaViewComponent,
    DomandaComponent,
    SalvaAnnullaButtonComponent,
    IntestazioneComponent,
    DomandeComponent,
    ListaDomandeCommissioneComponent,
    BandoViewComponent,
    CandidatiComponent,
    MyFilterhourPipe,
    LogAttivitaComponent,
  ],

  imports: [
    SharedModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    CommonModule,
    NgbModule.forRoot(),
    NgbTooltipModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    RouterModule,
    LoadingModule,
    PerfectScrollbarModule,
    NgSelectModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    RoutingModuleModule,
    CoreModule,
    NgxDatatableModule,
    NgxPermissionsModule.forRoot(),
    PerfectScrollbarModule,
    ToastrModule.forRoot(),
    StorageServiceModule,
    PdfViewerModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: environment.whitelistedDomains, // ['localhost:4200', 'pcoliva.uniurb.it','unidemdev.uniurb.it'],
        blacklistedRoutes: environment.blacklistedRoutes, // ['localhost:4200/auth/']
      }
    }),
    TranslateModule.forRoot({
      missingTranslationHandler: {provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler},
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

  ],

  exports: [
    HomeComponent,
    UserComponent,
    UsersComponent,
    RoleComponent,
    RolesComponent,
    PermissionComponent,
    PermissionsComponent,
    MappingRuolo,
    MappingRuoli,
    LogAttivitaComponent,
  ],

  providers: [
    DatePipe,
    AuthService,
    NgbActiveModal,
    AuthGuard,
    LoginActivate,

    ConfirmationDialogService,
    // ApplicationService,
    UserService,
    MessageService,
    MessageCacheService,
    RoleService,
    PermissionService,
    HttpInterceptorProviders,
    GlobalErrorHandlerProviders,
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: RequestCache, useClass: RequestCacheWithMap },
    { provide: 'unitaorganizzativaService', useClass: UnitaOrganizzativaService },    
    { provide: 'roleService', useClass: RoleService },
    { provide: LOCALE_ID, useValue: 'it' },
    { provide: APP_BASE_HREF, useValue: environment.baseHref},
    PersonaInternaService,
    StrutturaInternaService,
    StrutturaEsternaService,
    DocumentoService,
    MappingRuoloService,
    MappingUfficioService,
    LogAttivitaService,
    {provide: 'personainternaService', useClass: PersonaInternaService},
    {provide: 'strutturainternaService', useClass: StrutturaInternaService},
    {provide: 'strutturaesternaService', useClass: StrutturaEsternaService},
    {provide: 'mappingufficititulusService', useClass: MappingUfficioService},
    {provide: 'documentoService', useClass: DocumentoService },
    {provide: 'mappingruoloService', useClass: MappingRuoloService },
    {provide: NgbDateAdapter, useClass: NgbStringAdapter},
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter},
    {  
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector],
      multi: true
    },       
  ],

  bootstrap: [
    AppComponent
  ],

  entryComponents: [ConfirmationDialogComponent, InputConfirmationDialogComponent],

})
export class AppModule {
  constructor(router: Router) {

  }
 }
