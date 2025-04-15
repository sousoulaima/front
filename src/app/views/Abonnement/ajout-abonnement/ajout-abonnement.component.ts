import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Abonnement {
  codeAbo: string;
  dateAbo: string;
  totalHTAbo: number;
  totalRemise: number;
  totalHTNC: number;
  totalTTC: number;
  solde_boclean: boolean;
  resteapayee: number;
  miPaye: string;
  dateDeb: string;
  dateFin: string;
  adherentCode: string;
  typeAbonnementCode: string;
  adherentName?: string; // For UI display
  typeDesignation?: string; // For UI display
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
    codeAbo: `ABO-${(Math.floor(Math.random() * 1000) + 1).toString().padStart(3, '0')}`,
    dateAbo: new Date().toISOString().split('T')[0],
    totalHTAbo: 0,
    totalRemise: 0,
    totalHTNC: 0,
    totalTTC: 0,
    solde_boclean: false,
    resteapayee: 0,
    miPaye: '',
    dateDeb: new Date().toISOString().split('T')[0],
    dateFin: '',
    adherentCode: '',
    typeAbonnementCode: '',
    adherentName: '',
    typeDesignation: '',
  };

  typeMontants: { [key: string]: { totalTTC: number; duration: number; code: string } } = {
    'Mensuel Standard': { totalTTC: 39.99, duration: 1, code: 'TYPE-001' },
    'Mensuel Premium': { totalTTC: 59.99, duration: 1, code: 'TYPE-002' },
    'Trimestriel Premium': { totalTTC: 169.99, duration: 3, code: 'TYPE-004' },
    'Annuel Standard': { totalTTC: 499.99, duration: 12, code: 'TYPE-005' },
  };

  constructor(private router: Router) {}

  updateMontant(): void {
    const typeInfo = this.typeMontants[this.newAbonnement.typeDesignation || ''];
    if (typeInfo) {
      const taxRate = 0.19; // Assuming 19% tax
      this.newAbonnement.totalTTC = typeInfo.totalTTC;
      this.newAbonnement.totalHTAbo = typeInfo.totalTTC / (1 + taxRate);
      this.newAbonnement.totalRemise = 0; // Default to 0 for new subscription
      this.newAbonnement.totalHTNC = this.newAbonnement.totalHTAbo;
      this.newAbonnement.typeAbonnementCode = typeInfo.code;
      this.calculateDateFin();
    } else {
      this.newAbonnement.totalTTC = 0;
      this.newAbonnement.totalHTAbo = 0;
      this.newAbonnement.totalRemise = 0;
      this.newAbonnement.totalHTNC = 0;
      this.newAbonnement.dateFin = '';
    }
  }

  calculateDateFin(): void {
    if (!this.newAbonnement.dateDeb || !this.newAbonnement.typeDesignation) {
      this.newAbonnement.dateFin = '';
      return;
    }
    const startDate = new Date(this.newAbonnement.dateDeb);
    const typeInfo = this.typeMontants[this.newAbonnement.typeDesignation];
    if (!typeInfo) return;
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + typeInfo.duration);
    this.newAbonnement.dateFin = endDate.toISOString().split('T')[0];
  }

  saveAbonnement(): void {
    // In a real app, map adherentName to adherentCode and typeDesignation to typeAbonnementCode
    console.log('Abonnement saved:', this.newAbonnement);
    this.router.navigate(['/liste-abonnement']);
  }

  goBack(): void {
    this.router.navigate(['/liste-abonnement']);
  }
}