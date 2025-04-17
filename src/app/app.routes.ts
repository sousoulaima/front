import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { GestionUtilisateursComponent } from './views/gestion-utilisateurs/gestion-utilisateurs.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Home',
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./views/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        data: { title: 'Dashboard' },
      },
      {
        path: 'gestion-utilisateurs',
        component: GestionUtilisateursComponent,
        data: { title: 'Gestion des Utilisateurs' },
      },
      {
        path: 'paramétrages',
        loadChildren: () => import('./views/paramétrages/routes').then((m) => m.routes),
      },
      {
        path: 'abonnement',
        loadChildren: () => import('./views/abonnement/routes').then((m) => m.routes),
      },
      {
        path: 'salle-formation',
        loadChildren: () => import('./views/salle-formation/routes').then((m) => m.routes),
      },
      {
        path: 'caisse',
        loadChildren: () => import('./views/caisse/routes').then((m) => m.routes),
      },
     
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/routes').then((m) => m.routes),
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes),
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes),
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes),
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes),
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/routes').then((m) => m.routes),
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes),
      },
    ],
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then((m) => m.Page404Component),
    data: {
      title: 'Page 404',
    },
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then((m) => m.Page500Component),
    data: {
      title: 'Page 500',
    },
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then((m) => m.LoginComponent),
    data: {
      title: 'Login Page',
    },
  },
  {
    path: 'signup',
    loadComponent: () => import('./views/pages/signup/signup.component').then((m) => m.SignupComponent),
    data: {
      title: 'Signup Page',
    },
  },
  { path: '**', redirectTo: '/login' },
];