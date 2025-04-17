import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AbonnementService, Abonnement } from '../../../services/abonnement.service';

@Component({
  selector: 'app-ajout-abonnement',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ajout-abonnement.component.html',
  styleUrls: ['./ajout-abonnement.component.scss'],
})
export class AjoutAbonnementComponent {
  newAbonnement: Partial<Abonnement> = {
    CodeAbo: `ABO-${(Math.floor(Math.random() * 1000) + 1).toString().padStart(3, '0')}`,
    DateAbo: new Date().toISOString().split('T')[0],
    TotalHTAbo: 0,
    TotalRemise: 0,
    TotalHTNC: 0,
    TotalTTC: 0,
    Solde_boclean: false,
    Resteapayee: 0,
    MIPaye: '',
    DateDeb: new Date().toISOString().split('T')[0],
    Datefin: '',
    IDPOINtage: '',
    Code: '',
    adherentName: '',
    typeDesignation: '',
  };

  typeMontants: { [key: string]: { totalTTC: number; duration: number; code: string } } = {
    'Mensuel Standard': { totalTTC: 39.99, duration: 1, code: 'TYPE-001' },
    'Mensuel Premium': { totalTTC: 59.99, duration: 1, code: 'TYPE-002' },
    'Trimestriel Premium': { totalTTC: 169.99, duration: 3, code: 'TYPE-004' },
    'Annuel Standard': { totalTTC: 499.99, duration: 12, code: 'TYPE-005' },
  };

  constructor(
    private router: Router,
    private abonnementService: AbonnementService
  ) {}

  updateMontant(): void {
    const typeInfo = this.typeMontants[this.newAbonnement.typeDesignation || ''];
    if (typeInfo) {
      const taxRate = 0.19; // Assuming 19% tax
      this.newAbonnement.TotalTTC = typeInfo.totalTTC;
      this.newAbonnement.TotalHTAbo = typeInfo.totalTTC / (1 + taxRate);
      this.newAbonnement.TotalRemise = 0;
      this.newAbonnement.TotalHTNC = this.newAbonnement.TotalHTAbo;
      this.newAbonnement.Code = typeInfo.code;
      this.calculateDateFin();
    } else {
      this.newAbonnement.TotalTTC = 0;
      this.newAbonnement.TotalHTAbo = 0;
      this.newAbonnement.TotalRemise = 0;
      this.newAbonnement.TotalHTNC = 0;
      this.newAbonnement.Datefin = '';
    }
  }

  updateFinancials(): void {
    const totalHTAbo = this.newAbonnement.TotalHTAbo || 0;
    const totalRemise = this.newAbonnement.TotalRemise || 0;
    const taxRate = 0.19; // Assuming 19% tax
    this.newAbonnement.TotalHTNC = totalHTAbo - totalRemise;
    this.newAbonnement.TotalTTC = this.newAbonnement.TotalHTNC * (1 + taxRate);
  }

  calculateDateFin(): void {
    if (!this.newAbonnement.DateDeb || !this.newAbonnement.typeDesignation) {
      this.newAbonnement.Datefin = '';
      return;
    }
    const startDate = new Date(this.newAbonnement.DateDeb);
    const typeInfo = this.typeMontants[this.newAbonnement.typeDesignation];
    if (!typeInfo) return;
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + typeInfo.duration);
    this.newAbonnement.Datefin = endDate.toISOString().split('T')[0];
  }

  saveAbonnement(): void {
    if (this.newAbonnement.adherentName && this.newAbonnement.typeDesignation) {
      if (!this.newAbonnement.IDPOINtage) {
        this.newAbonnement.IDPOINtage = `ADH-${(Math.floor(Math.random() * 1000) + 1).toString().padStart(3, '0')}`;
      }
      this.abonnementService.addAbonnement(this.newAbonnement as Abonnement);
      alert('Abonnement bien enregistré');
      this.router.navigate(['/liste-abonnement']);
    }
  }

  goBack(): void {
    this.router.navigate(['/liste-abonnement']);
  }
}