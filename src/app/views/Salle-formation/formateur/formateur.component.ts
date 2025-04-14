import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface Formateur {
  code: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  specialite: string;
  statut: 'Actif' | 'Inactif';
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
  filterStatut = '';
  showFilter = false;
  showModal = false;
  showViewModal = false;
  showDeleteConfirm = false;
  isEditing = false;
  formateurToDelete: Formateur | null = null;
  viewedFormateur: Formateur | null = null;

  formateurs: Formateur[] = [
    {
      code: 'FOR-001',
      nom: 'Leroy',
      prenom: 'Marie',
      email: 'marie.leroy@email.com',
      telephone: '0612345678',
      specialite: 'Yoga, Pilates',
      statut: 'Actif',
    },
    {
      code: 'FOR-002',
      nom: 'Girard',
      prenom: 'Thomas',
      email: 'thomas.girard@email.com',
      telephone: '0698765432',
      specialite: 'Musculation, HIIT',
      statut: 'Actif',
    },
    {
      code: 'FOR-003',
      nom: 'Petit',
      prenom: 'Julie',
      email: 'julie.petit@email.com',
      telephone: '0654321987',
      specialite: 'Cardio, HIIT',
      statut: 'Actif',
    },
    {
      code: 'FOR-004',
      nom: 'Blanc',
      prenom: 'Sophie',
      email: 'sophie.blanc@email.com',
      telephone: '0678901234',
      specialite: 'Pilates, Stretching',
      statut: 'Actif',
    },
    {
      code: 'FOR-005',
      nom: 'Martin',
      prenom: 'Lucas',
      email: 'lucas.martin@email.com',
      telephone: '0712345678',
      specialite: 'Boxe, Arts martiaux',
      statut: 'Inactif',
    },
    {
      code: 'FOR-006',
      nom: 'Rousseau',
      prenom: 'Emma',
      email: 'emma.rousseau@email.com',
      telephone: '0687654321',
      specialite: 'Zumba, Danse',
      statut: 'Actif',
    },
  ];

  filteredFormateurs: Formateur[] = [...this.formateurs];
  currentFormateur: Partial<Formateur> = this.resetFormateur();

  constructor(private cdr: ChangeDetectorRef) {}

  resetFormateur(): Partial<Formateur> {
    return {
      code: '',
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      specialite: '',
      statut: 'Actif',
    };
  }

  filterFormateurs(): void {
    this.filteredFormateurs = this.formateurs.filter((formateur) => {
      const query = this.searchQuery.toLowerCase();
      const matchesSearch =
        formateur.code.toLowerCase().includes(query) ||
        formateur.nom.toLowerCase().includes(query) ||
        formateur.prenom.toLowerCase().includes(query) ||
        formateur.email.toLowerCase().includes(query) ||
        formateur.telephone.includes(query) ||
        formateur.specialite.toLowerCase().includes(query);
      const matchesStatut = this.filterStatut ? formateur.statut === this.filterStatut : true;
      return matchesSearch && matchesStatut;
    });
    this.cdr.detectChanges();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
    this.cdr.detectChanges();
  }

  getStatutClass(statut: string | undefined): string {
    return statut || '';
  }

  openAddFormateurModal(): void {
    this.isEditing = false;
    this.currentFormateur = this.resetFormateur();
    this.currentFormateur.code = `FOR-${(this.formateurs.length + 1).toString().padStart(3, '0')}`;
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
    if (this.isEditing) {
      const index = this.formateurs.findIndex((f) => f.code === this.currentFormateur.code);
      if (index !== -1) {
        this.formateurs[index] = { ...this.currentFormateur } as Formateur;
      }
    } else {
      this.formateurs.push({ ...this.currentFormateur } as Formateur);
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
      this.formateurs = this.formateurs.filter((f) => f.code !== this.formateurToDelete!.code);
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