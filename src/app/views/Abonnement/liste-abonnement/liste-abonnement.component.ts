import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Correct import
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

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
  selector: 'app-liste-abonnement',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './liste-abonnement.component.html',
  styleUrls: ['./liste-abonnement.component.scss'],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' })),
      ]),
    ]),
    trigger('filterAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' })),
      ]),
    ]),
  ],
})
export class ListeAbonnementComponent {
  abonnements: Abonnement[] = [
    {
      code: 'ABO-001',
      adherent: 'Dupont Martin',
      dateDebut: '2025-01-01',
      dateFin: '2025-02-01',
      type: 'Mensuel Standard',
      montant: 39.99,
      paiement: 'Payé',
      statut: 'Actif',
    },
    {
      code: 'ABO-002',
      adherent: 'Laurent Sophie',
      dateDebut: '2025-02-01',
      dateFin: '2025-03-01',
      type: 'Mensuel Premium',
      montant: 59.99,
      paiement: 'Non payé',
      statut: 'Actif',
    },
    {
      code: 'ABO-003',
      adherent: 'Dubois Lucas',
      dateDebut: '2025-01-15',
      dateFin: '2026-01-15',
      type: 'Annuel Standard',
      montant: 499.99,
      paiement: 'Partiel',
      statut: 'Inactif',
    },
    {
      code: 'ABO-004',
      adherent: 'Bernard Emma',
      dateDebut: '2025-03-01',
      dateFin: '2025-06-01',
      type: 'Trimestriel Premium',
      montant: 169.99,
      paiement: 'Payé',
      statut: 'Actif',
    },
  ];

  filteredAbonnements: Abonnement[] = [...this.abonnements];
  searchQuery = '';
  filterType = '';
  filterStatut = '';
  filterPaiement = '';
  showFilter = false;
  showModal = false;
  showViewModal = false;
  showDeleteConfirm = false;
  isEditing = false;
  currentAbonnement: Partial<Abonnement> = {};
  viewedAbonnement: Abonnement | null = null;
  abonnementToDelete: Abonnement | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  filterAbonnements(): void {
    this.filteredAbonnements = this.abonnements.filter((abonnement) => {
      const matchesSearch =
        abonnement.code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        abonnement.adherent.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        abonnement.dateDebut.includes(this.searchQuery) ||
        abonnement.dateFin.includes(this.searchQuery) ||
        abonnement.type.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesType = this.filterType ? abonnement.type === this.filterType : true;
      const matchesStatut = this.filterStatut ? abonnement.statut === this.filterStatut : true;
      const matchesPaiement = this.filterPaiement ? abonnement.paiement === this.filterPaiement : true;
      return matchesSearch && matchesType && matchesStatut && matchesPaiement;
    });
    this.cdr.detectChanges();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
    this.cdr.detectChanges();
  }

  getPaiementClass(paiement: string | undefined): string {
    if (!paiement) return '';
    return paiement.replace(' ', '-');
  }

  getStatutClass(statut: string | undefined): string {
    return statut || '';
  }

  openEditAbonnementModal(abonnement: Abonnement): void {
    this.isEditing = true;
    this.currentAbonnement = { ...abonnement };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.currentAbonnement = {};
    this.cdr.detectChanges();
  }

  saveAbonnement(): void {
    if (this.isEditing) {
      const index = this.abonnements.findIndex((a) => a.code === (this.currentAbonnement as Abonnement).code);
      if (index !== -1) {
        this.abonnements[index] = { ...this.currentAbonnement } as Abonnement;
      }
    }
    this.filteredAbonnements = [...this.abonnements];
    this.closeModal();
  }

  viewAbonnement(abonnement: Abonnement): void {
    this.viewedAbonnement = abonnement;
    this.showViewModal = true;
    this.cdr.detectChanges();
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.viewedAbonnement = null;
    this.cdr.detectChanges();
  }

  confirmDeleteAbonnement(abonnement: Abonnement): void {
    this.abonnementToDelete = abonnement;
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.abonnementToDelete = null;
    this.cdr.detectChanges();
  }

  deleteAbonnement(): void {
    if (this.abonnementToDelete) {
      this.abonnements = this.abonnements.filter((a) => a.code !== this.abonnementToDelete!.code);
      this.filteredAbonnements = [...this.abonnements];
      this.cancelDelete();
    }
  }
}