import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { AbonnementService, Abonnement } from '../../../services/abonnement.service';

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
export class ListeAbonnementComponent implements OnInit {
  abonnements: Abonnement[] = [];
  filteredAbonnements: Abonnement[] = [];
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

  typeMontants: { [key: string]: { totalTTC: number; duration: number; code: string } } = {
    'Mensuel Standard': { totalTTC: 39.99, duration: 1, code: 'TYPE-001' },
    'Mensuel Premium': { totalTTC: 59.99, duration: 1, code: 'TYPE-002' },
    'Trimestriel Premium': { totalTTC: 169.99, duration: 3, code: 'TYPE-004' },
    'Annuel Standard': { totalTTC: 499.99, duration: 12, code: 'TYPE-005' },
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private abonnementService: AbonnementService
  ) {}

  ngOnInit(): void {
    this.abonnements = this.abonnementService.getAbonnements();
    this.filteredAbonnements = [...this.abonnements];
  }

  filterAbonnements(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredAbonnements = this.abonnements.filter((abonnement) => {
      const matchesSearch =
        (abonnement.CodeAbo?.toLowerCase().includes(query) ?? false) ||
        (abonnement.adherentName?.toLowerCase().includes(query) ?? false) ||
        (abonnement.DateAbo?.includes(query) ?? false) ||
        (abonnement.DateDeb?.includes(query) ?? false) ||
        (abonnement.Datefin?.includes(query) ?? false) ||
        (abonnement.typeDesignation?.toLowerCase().includes(query) ?? false);
      const matchesType = this.filterType ? abonnement.typeDesignation === this.filterType : true;
      const matchesMiPaye = this.filterMiPaye ? abonnement.MIPaye === this.filterMiPaye : true;
      return matchesSearch && matchesType && matchesMiPaye;
    });
    this.cdr.detectChanges();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
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

  updateFinancials(): void {
    const totalHTAbo = this.currentAbonnement.TotalHTAbo || 0;
    const totalRemise = this.currentAbonnement.TotalRemise || 0;
    const taxRate = 0.19; // Assuming 19% tax
    this.currentAbonnement.TotalHTNC = totalHTAbo - totalRemise;
    this.currentAbonnement.TotalTTC = this.currentAbonnement.TotalHTNC * (1 + taxRate);
    this.cdr.detectChanges();
  }

  updateDateFin(): void {
    if (!this.currentAbonnement.DateDeb || !this.currentAbonnement.typeDesignation) {
      this.currentAbonnement.Datefin = '';
      return;
    }
    const startDate = new Date(this.currentAbonnement.DateDeb);
    const typeInfo = this.typeMontants[this.currentAbonnement.typeDesignation];
    if (!typeInfo) return;
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + typeInfo.duration);
    this.currentAbonnement.Datefin = endDate.toISOString().split('T')[0];
    this.currentAbonnement.Code = typeInfo.code;
    this.cdr.detectChanges();
  }

  saveAbonnement(): void {
    if (this.isEditing && this.currentAbonnement.CodeAbo) {
      this.abonnementService.updateAbonnement(this.currentAbonnement as Abonnement);
      this.abonnements = this.abonnementService.getAbonnements();
      this.filteredAbonnements = [...this.abonnements];
    }
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
    if (this.abonnementToDelete?.CodeAbo) {
      this.abonnementService.deleteAbonnement(this.abonnementToDelete.CodeAbo);
      this.abonnements = this.abonnementService.getAbonnements();
      this.filteredAbonnements = [...this.abonnements];
      this.cancelDelete();
    }
  }

  getMiPayeClass(miPaye: string | undefined): string {
    switch (miPaye) {
      case 'Espèces':
        return 'miPaye-especes';
      case 'Carte':
        return 'miPaye-carte';
      case 'Chèque':
        return 'miPaye-cheque';
      default:
        return '';
    }
  }
}