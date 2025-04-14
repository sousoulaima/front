import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Abonnement {
  code: string;
  adherent: string;
  dateDebut: string;
  dateFin: string;
  type: string;
  montant: number;
  paiement?: 'Payé' | 'Non payé' | 'Partiel';
  statut: 'Actif' | 'Inactif';
}

@Component({
  selector: 'app-ajout-abonnement',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ajout-abonnement.component.html',
  styleUrls: ['./ajout-abonnement.component.scss'],
})
export class AjoutAbonnementComponent {
  newAbonnement: Partial<Abonnement> = {
    code: `ABO-${(Math.floor(Math.random() * 1000) + 1).toString().padStart(3, '0')}`,
    adherent: '',
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: '',
    type: '',
    montant: 0,
    paiement: undefined,
    statut: 'Actif',
  };

  typeMontants: { [key: string]: { montant: number; duration: number } } = {
    'Mensuel Standard': { montant: 39.99, duration: 1 },
    'Mensuel Premium': { montant: 59.99, duration: 1 },
    'Trimestriel Premium': { montant: 169.99, duration: 3 },
    'Annuel Standard': { montant: 499.99, duration: 12 },
  };

  constructor(private router: Router) {}

  updateMontant(): void {
    const typeInfo = this.typeMontants[this.newAbonnement.type || ''];
    this.newAbonnement.montant = typeInfo ? typeInfo.montant : 0;
    this.calculateDateFin();
  }

  calculateDateFin(): void {
    if (!this.newAbonnement.dateDebut || !this.newAbonnement.type) {
      this.newAbonnement.dateFin = '';
      return;
    }
    const startDate = new Date(this.newAbonnement.dateDebut);
    const typeInfo = this.typeMontants[this.newAbonnement.type];
    if (!typeInfo) return;
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + typeInfo.duration);
    this.newAbonnement.dateFin = endDate.toISOString().split('T')[0];
  }

  saveAbonnement(): void {
    console.log('Abonnement saved:', this.newAbonnement);
    this.router.navigate(['/liste-abonnement']);
  }

  goBack(): void {
    this.router.navigate(['/liste-abonnement']);
  }
}