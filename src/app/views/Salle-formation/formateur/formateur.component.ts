import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface Formateur {
  codeFor: string;
  nomFor: string;
  prenomFor: string;
  telFor: string;
  emailFor: string;
  adrFor: string;
  created_at?: string;
  updated_at?: string;
}

@Component({
  selector: 'app-formateur',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './formateur.component.html',
  styleUrls: ['./formateur.component.scss'],
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
export class FormateurComponent {
  searchQuery = '';
  showFilter = false;
  showModal = false;
  showViewModal = false;
  showDeleteConfirm = false;
  isEditing = false;
  formateurToDelete: Formateur | null = null;
  viewedFormateur: Formateur | null = null;

  formateurs: Formateur[] = [
    {
      codeFor: 'FOR-001',
      nomFor: 'Leroy',
      prenomFor: 'Marie',
      telFor: '0612345678',
      emailFor: 'marie.leroy@email.com',
      adrFor: '123 Rue de Paris, 75001 Paris',
      created_at: '2025-01-01 10:00:00',
      updated_at: '2025-01-02 15:30:00',
    },
    {
      codeFor: 'FOR-002',
      nomFor: 'Girard',
      prenomFor: 'Thomas',
      telFor: '0698765432',
      emailFor: 'thomas.girard@email.com',
      adrFor: '456 Avenue des Champs, 75008 Paris',
      created_at: '2025-02-01 09:00:00',
      updated_at: '2025-02-03 14:20:00',
    },
    {
      codeFor: 'FOR-003',
      nomFor: 'Petit',
      prenomFor: 'Julie',
      telFor: '0654321987',
      emailFor: 'julie.petit@email.com',
      adrFor: '789 Boulevard St-Germain, 75006 Paris',
      created_at: '2025-03-01 11:00:00',
      updated_at: '2025-03-01 11:00:00',
    },
    {
      codeFor: 'FOR-004',
      nomFor: 'Blanc',
      prenomFor: 'Sophie',
      telFor: '0678901234',
      emailFor: 'sophie.blanc@email.com',
      adrFor: '321 Rue de Lyon, 69003 Lyon',
      created_at: '2025-04-01 08:30:00',
      updated_at: '2025-04-02 16:00:00',
    },
    {
      codeFor: 'FOR-005',
      nomFor: 'Martin',
      prenomFor: 'Lucas',
      telFor: '0712345678',
      emailFor: 'lucas.martin@email.com',
      adrFor: '654 Avenue de la Mer, 13001 Marseille',
      created_at: '2025-05-01 12:00:00',
      updated_at: '2025-05-01 12:00:00',
    },
    {
      codeFor: 'FOR-006',
      nomFor: 'Rousseau',
      prenomFor: 'Emma',
      telFor: '0687654321',
      emailFor: 'emma.rousseau@email.com',
      adrFor: '987 Rue du Nord, 59000 Lille',
      created_at: '2025-06-01 10:00:00',
      updated_at: '2025-06-02 13:45:00',
    },
  ];

  filteredFormateurs: Formateur[] = [...this.formateurs];
  currentFormateur: Partial<Formateur> = this.resetFormateur();

  constructor(private cdr: ChangeDetectorRef) {}

  resetFormateur(): Partial<Formateur> {
    return {
      codeFor: '',
      nomFor: '',
      prenomFor: '',
      telFor: '',
      emailFor: '',
      adrFor: '',
    };
  }

  filterFormateurs(): void {
    this.filteredFormateurs = this.formateurs.filter((formateur) => {
      const query = this.searchQuery.toLowerCase();
      return (
        formateur.codeFor.toLowerCase().includes(query) ||
        formateur.nomFor.toLowerCase().includes(query) ||
        formateur.prenomFor.toLowerCase().includes(query) ||
        formateur.emailFor.toLowerCase().includes(query) ||
        formateur.telFor.includes(query) ||
        formateur.adrFor.toLowerCase().includes(query)
      );
    });
    this.cdr.detectChanges();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
    this.cdr.detectChanges();
  }

  openAddFormateurModal(): void {
    this.isEditing = false;
    this.currentFormateur = this.resetFormateur();
    this.currentFormateur.codeFor = `FOR-${(this.formateurs.length + 1).toString().padStart(3, '0')}`;
    this.showModal = true;
    this.cdr.detectChanges();
  }

  openEditFormateurModal(formateur: Formateur): void {
    this.isEditing = true;
    this.currentFormateur = { ...formateur };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.currentFormateur = this.resetFormateur();
    this.cdr.detectChanges();
  }

  saveFormateur(): void {
    const now = new Date().toISOString().replace('T', ' ').split('.')[0];
    if (this.isEditing) {
      const index = this.formateurs.findIndex((f) => f.codeFor === this.currentFormateur.codeFor);
      if (index !== -1) {
        this.formateurs[index] = {
          ...this.currentFormateur,
          updated_at: now,
          created_at: this.formateurs[index].created_at, // Preserve original created_at
        } as Formateur;
      }
    } else {
      this.formateurs.push({
        ...this.currentFormateur,
        created_at: now,
        updated_at: now,
      } as Formateur);
    }
    this.filteredFormateurs = [...this.formateurs];
    this.closeModal();
  }

  viewFormateur(formateur: Formateur): void {
    this.viewedFormateur = formateur;
    this.showViewModal = true;
    this.cdr.detectChanges();
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.viewedFormateur = null;
    this.cdr.detectChanges();
  }

  confirmDeleteFormateur(formateur: Formateur): void {
    this.formateurToDelete = formateur;
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }

  deleteFormateur(): void {
    if (this.formateurToDelete) {
      this.formateurs = this.formateurs.filter((f) => f.codeFor !== this.formateurToDelete!.codeFor);
      this.filteredFormateurs = [...this.formateurs];
      this.cancelDelete();
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.formateurToDelete = null;
    this.cdr.detectChanges();
  }
}