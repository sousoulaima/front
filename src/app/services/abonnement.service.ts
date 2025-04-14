import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AbonnementService {
  private abonnementsSubject = new BehaviorSubject<any[]>([
    { code: 'ABO-001', adherent: 'Dupont Martin', dateDebut: '05/04/2025', dateFin: '05/05/2025', type: 'Mensuel Premium', montant: 59.99, paiement: 'Payé', statut: 'Actif' },
    { code: 'ABO-002', adherent: 'Laurent Sophie', dateDebut: '01/04/2025', dateFin: '01/04/2026', type: 'Annuel Standard', montant: 499.99, paiement: 'Payé', statut: 'Actif' },
    { code: 'ABO-003', adherent: 'Dubois Lucas', dateDebut: '01/04/2025', dateFin: '01/05/2025', type: 'Mensuel Standard', montant: 39.99, paiement: 'Payé', statut: 'Actif' },
    { code: 'ABO-004', adherent: 'Bernard Emma', dateDebut: '01/03/2025', dateFin: '01/06/2025', type: 'Trimestriel Premium', montant: 169.99, paiement: 'Partiel', statut: 'Actif' },
    { code: 'ABO-005', adherent: 'Moreau Pierre', dateDebut: '25/03/2025', dateFin: '25/04/2025', type: 'Mensuel Standard', montant: 39.99, paiement: 'Payé', statut: 'Actif' },
    { code: 'ABO-006', adherent: 'Lefebvre Julie', dateDebut: '15/03/2025', dateFin: '15/04/2025', type: 'Mensuel Standard', montant: 39.99, paiement: 'Payé', statut: 'Actif' },
    { code: 'ABO-007', adherent: 'Girard Thomas', dateDebut: '10/03/2025', dateFin: '10/04/2025', type: 'Mensuel Premium', montant: 59.99, paiement: 'Non payé', statut: 'Inactif' },
  ]);

  abonnements$ = this.abonnementsSubject.asObservable();

  getAbonnements(): any[] {
    return this.abonnementsSubject.getValue();
  }

  addAbonnement(abonnement: any) {
    const currentAbonnements = this.abonnementsSubject.getValue();
    currentAbonnements.push(abonnement);
    this.abonnementsSubject.next(currentAbonnements);
  }

  updateAbonnement(updatedAbonnement: any) {
    const currentAbonnements = this.abonnementsSubject.getValue();
    const index = currentAbonnements.findIndex((a) => a.code === updatedAbonnement.code);
    if (index !== -1) {
      currentAbonnements[index] = updatedAbonnement;
      this.abonnementsSubject.next(currentAbonnements);
    }
  }

  deleteAbonnement(code: string) {
    const currentAbonnements = this.abonnementsSubject.getValue();
    const updatedAbonnements = currentAbonnements.filter((a) => a.code !== code);
    this.abonnementsSubject.next(updatedAbonnements);
  }
}