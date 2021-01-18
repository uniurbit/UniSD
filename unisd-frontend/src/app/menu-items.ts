import { RouteInfo } from '../app/shared/sidebar/sidebar.metadata';

export const ROUTES: RouteInfo[] = [

  {
    path: 'dashboard/dashboarddocenti',
    title: 'Dashboard docente',
    icon: 'icon-Car-Wheel',
    class: '',
    permissions: ['ADMIN_AMM', 'SUPER-ADMIN', 'OP_DOCENTE'],
    extralink: false,
    submenu: []
  },
  {
    path: 'dashboard/dashboardcommissione',
    title: 'Dashboard commissione',
    icon: 'icon-Car-Wheel',
    class: '',
    permissions: ['ADMIN_AMM', 'SUPER-ADMIN', 'OP_COMMISSIONE'],
    extralink: false,
    submenu: []
  },
  // BANDI'
  {
    path: '',
    title: 'Bandi',
    icon: 'mdi mdi-dots-horizontal',
    class: 'nav-small-cap',
    extralink: true,
    permissions: ['SUPER-ADMIN', 'OP_UFF_AMM'],
    submenu: [

    ],
  },

  {
    path: 'bandi/new', //'copertura-ugov',
    title: 'Nuovo bando',
    icon: 'icon-File',
    class: '',
    extralink: false,
    submenu: [],
    permissions: ['SUPER-ADMIN', 'OP_UFF_AMM'],
  },
  {
    path: 'bandi', //'copertura-ugov',
    title: 'Ricerca bandi',
    icon: 'icon-File-Search',
    class: '',
    extralink: false,
    submenu: [],
    permissions: ['SUPER-ADMIN', 'OP_UFF_AMM'],
  },
  {
    path: 'candidati', //'copertura-ugov',
    title: 'Ricerca candidati',
    icon: 'icon-File-Search',
    class: '',
    extralink: false,
    submenu: [],
    permissions: ['SUPER-ADMIN', 'OP_UFF_AMM'],
  },
  // Domande'
  {
    path: '',
    title: 'Domande',
    icon: 'mdi mdi-dots-horizontal',
    class: 'nav-small-cap',
    extralink: true,
    permissions: ['SUPER-ADMIN', 'OP_DOCENTE', 'OP_COMMISSIONE', 'OP_UFF_AMM'],
    submenu: [

    ],
  },

  {
    path: 'lista-bandi-domanda', //'copertura-ugov',
    title: 'Nuova domanda',
    icon: 'icon-File',
    class: '',
    extralink: false,
    submenu: [],
    permissions: ['SUPER-ADMIN', 'OP_DOCENTE'],
  },
  {
    path: 'lista-domande', //'copertura-ugov',
    title: 'Lista domande',
    icon: 'icon-File-Search',
    class: '',
    extralink: false,
    submenu: [],
    permissions: ['SUPER-ADMIN', 'OP_UFF_AMM', 'OP_DOCENTE'],
  },
  // Commissione'
  {
    path: '',
    title: 'Commissione',
    icon: 'mdi mdi-dots-horizontal',
    class: 'nav-small-cap',
    extralink: true,
    permissions: ['SUPER-ADMIN', 'OP_UFF_AMM', 'OP_COMMISSIONE'],
    submenu: [

    ],
  },
  {
    path: 'lista-domande-commissione',
    title: 'Domande commissione',
    icon: 'icon-File-Search',
    class: '',
    extralink: false,
    submenu: [],
    permissions: ['SUPER-ADMIN', 'OP_UFF_AMM', 'OP_COMMISSIONE'],
  },

  // GESTIONE
  {
    path: '',
    title: 'Gestione',
    icon: 'mdi mdi-dots-horizontal',
    class: 'nav-small-cap',
    extralink: true,
    permissions: ['ADMIN', 'SUPER-ADMIN'],
    submenu: [],
  },
  {
    path: '',
    title: 'Utenti',
    icon: 'icon-Administrator',
    class: 'has-arrow',
    extralink: false,
    permissions: ['ADMIN', 'SUPER-ADMIN'],
    submenu: [
      {
        path: 'users',
        title: 'Utenti',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
        permissions: ['ADMIN', 'SUPER-ADMIN'],
      },
      {
        path: 'roles',
        title: 'Ruoli',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
        permissions: ['ADMIN', 'SUPER-ADMIN'],
      },
      {
        path: 'permissions',
        title: 'Permessi',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
        permissions: ['ADMIN', 'SUPER-ADMIN'],
      },
      {
        path: 'mappingruoli',
        title: 'Associazione ruoli',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
        permissions: ['SUPER-ADMIN'],
      },
      {
        path: 'logattivita',
        title: 'Log',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
        permissions: ['SUPER-ADMIN'],
      },
    ]
  }, // chiude gestione utenti
  {
    path: '',
    title: 'Configurazioni',
    icon: 'icon-Gear',
    class: 'has-arrow',
    extralink: false,
    permissions: ['SUPER-ADMIN'],
    submenu: [
      {
        path: 'mappinguffici',
        title: 'Mapping uffici',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
        permissions: ['SUPER-ADMIN'],
      },
    ]
  }, // chiude configurazioni
  {
    path: '',
    title: 'Ricerche Titulus',
    icon: 'icon-Paint-Brush',
    class: 'has-arrow',
    extralink: false,
    permissions: ['ADMIN', 'SUPER-ADMIN'],
    submenu: [
      {
        path: 'personeinterne',
        title: 'Persone interne',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
        permissions: ['SUPER-ADMIN'],
      },
      {
        path: 'struttureinterne',
        title: 'Strutture interne',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
        permissions: ['SUPER-ADMIN'],
      },
      {
        path: 'struttureesterne',
        title: 'Strutture esterne',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
        permissions: ['SUPER-ADMIN'],
      },
      {
        path: 'documenti',
        title: 'Documenti',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
        permissions: ['SUPER-ADMIN'],
      },
    ]
  }, // chiude ricerche titulus

];
