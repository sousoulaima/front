import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'listedesSalle',
    loadComponent: () => import('./liste-salle/liste-salle.component').then(m => m.ListeSalleComponent),
    data: {
      title: 'Liste des salle '
    }
  },
  {
    path: 'formateur',
    loadComponent: () => import('./formateur/formateur.component').then(m => m.FormateurComponent),
    data: {
      title: 'Categorie Abonnement'
    }
  },
  {
    path: 'reservation',
    loadComponent: () => import('./reservation/reservation.component').then(m => m.ReservationComponent),
    data: {
      title: 'Type Abonnement'
    }
  }
];
