import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AbonnementService {
  private abonnements: Abonnement[] = [];

  getAbonnements(): Abonnement[] {
    return [...this.abonnements];
  }

  addAbonnement(abonnement: Abonnement): void {
    this.abonnements.push({ ...abonnement });
  }

  updateAbonnement(updatedAbonnement: Abonnement): void {
    const index = this.abonnements.findIndex(
      (abo) => abo.CodeAbo === updatedAbonnement.CodeAbo
    );
    if (index !== -1) {
      this.abonnements[index] = { ...updatedAbonnement };
    }
  }

  deleteAbonnement(codeAbo: string): void {
    this.abonnements = this.abonnements.filter((abo) => abo.CodeAbo !== codeAbo);
  }
}

export interface Abonnement {
  CodeAbo: string;
  DateAbo: string;
  TotalHTAbo: number;
  TotalRemise: number;
  TotalHTNC: number;
  TotalTTC: number;
  Solde_boclean: boolean;
  Resteapayee: number;
  MIPaye: string;
  DateDeb: string;
  Datefin: string;
  IDPOINtage: string; // Foreign key to Adherent
  Code: string; // Foreign key to Type_Abonnement
  adherentName: string; // For display purposes
  typeDesignation: string; // For display purposes
  remarques?: string; // Optional field for notes
}