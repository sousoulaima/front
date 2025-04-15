import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

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
      codeAbo: 'ABO-001',
      dateAbo: '2025-01-01',
      totalHTAbo: 33.61, // Example: 39.99 / 1.19 (assuming 19% tax)
      totalRemise: 0,
      totalHTNC: 33.61,
      totalTTC: 39.99,
      solde_boclean: true,
      resteapayee: 0,
      miPaye: 'Espèces',
      dateDeb: '2025-01-01',
      dateFin: '2025-02-01',
      adherentCode: 'ADH-001',
      typeAbonnementCode: 'TYPE-001',
      adherentName: 'Dupont Martin',
      typeDesignation: 'Mensuel Standard',
    },
    {
      codeAbo: 'ABO-002',
      dateAbo: '2025-02-01',
      totalHTAbo: 50.41, // Example: 59.99 / 1.19
      totalRemise: 0,
      totalHTNC: 50.41,
      totalTTC: 59.99,
      solde_boclean: false,
      resteapayee: 59.99,
      miPaye: 'Carte',
      dateDeb: '2025-02-01',
      dateFin: '2025-03-01',
      adherentCode: 'ADH-002',
      typeAbonnementCode: 'TYPE-002',
      adherentName: 'Laurent Sophie',
      typeDesignation: 'Mensuel Premium',
    },
    {
      codeAbo: 'ABO-003',
      dateAbo: '2025-01-15',
      totalHTAbo: 420.16, // Example: 499.99 / 1.19
      totalRemise: 50,
      totalHTNC: 370.16,
      totalTTC: 440.49, // 370.16 * 1.19
      solde_boclean: false,
      resteapayee: 220.25, // Example: half paid
      miPaye: 'Chèque',
      dateDeb: '2025-01-15',
      dateFin: '2026-01-15',
      adherentCode: 'ADH-003',
      typeAbonnementCode: 'TYPE-005',
      adherentName: 'Dubois Lucas',
      typeDesignation: 'Annuel Standard',
    },
    {
      codeAbo: 'ABO-004',
      dateAbo: '2025-03-01',
      totalHTAbo: 142.85, // Example: 169.99 / 1.19
      totalRemise: 0,
      totalHTNC: 142.85,
      totalTTC: 169.99,
      solde_boclean: true,
      resteapayee: 0,
      miPaye: 'Espèces',
      dateDeb: '2025-03-01',
      dateFin: '2025-06-01',
      adherentCode: 'ADH-004',
      typeAbonnementCode: 'TYPE-004',
      adherentName: 'Bernard Emma',
      typeDesignation: 'Trimestriel Premium',
    },
  ];

  filteredAbonnements: Abonnement[] = [...this.abonnements];
  searchQuery = '';
  filterType = '';
  filterMiPaye = '';
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
        (abonnement.codeAbo?.toLowerCase().includes(this.searchQuery.toLowerCase()) || '') ||
        (abonnement.adherentName?.toLowerCase().includes(this.searchQuery.toLowerCase()) || '') ||
        (abonnement.dateAbo?.includes(this.searchQuery) || '') ||
        (abonnement.dateDeb?.includes(this.searchQuery) || '') ||
        (abonnement.dateFin?.includes(this.searchQuery) || '') ||
        (abonnement.typeDesignation?.toLowerCase().includes(this.searchQuery.toLowerCase()) || '');
      const matchesType = this.filterType ? abonnement.typeDesignation === this.filterType : true;
      const matchesMiPaye = this.filterMiPaye ? abonnement.miPaye === this.filterMiPaye : true;
      return matchesSearch && matchesType && matchesMiPaye;
    });
    this.cdr.detectChanges();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
    this.cdr.detectChanges();
  }

  getMiPayeClass(miPaye: string | undefined): string {
    return miPaye || '';
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
      const index = this.abonnements.findIndex((a) => a.codeAbo === (this.currentAbonnement as Abonnement).codeAbo);
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
      this.abonnements = this.abonnements.filter((a) => a.codeAbo !== this.abonnementToDelete!.codeAbo);
      this.filteredAbonnements = [...this.abonnements];
      this.cancelDelete();
    }
  }
}