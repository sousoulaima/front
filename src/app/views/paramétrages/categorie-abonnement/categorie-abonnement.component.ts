import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface Categorie {
  code: string;
  designation: string;
  description: string;
  statut: 'Actif' | 'Inactif';
}

@Component({
  selector: 'app-categorie-abonnement',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './categorie-abonnement.component.html',
  styleUrls: ['./categorie-abonnement.component.scss'],
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
  ],
})
export class CategorieAbonnementComponent {
  categories: Categorie[] = [
    { code: 'CAT-001', designation: 'Standard', description: 'Accès aux équipements de base', statut: 'Actif' },
    { code: 'CAT-002', designation: 'Premium', description: 'Accès à tous les équipements et services', statut: 'Actif' },
    { code: 'CAT-003', designation: 'Étudiant', description: 'Tarifs réduits pour les étudiants', statut: 'Actif' },
    { code: 'CAT-004', designation: 'Senior', description: 'Tarifs adaptés pour les seniors', statut: 'Actif' },
    { code: 'CAT-005', designation: 'Famille', description: 'Abonnements pour plusieurs membres d’une même famille', statut: 'Actif' },
    { code: 'CAT-006', designation: 'Entreprise', description: 'Abonnements groupés pour les entreprises', statut: 'Actif' },
    { code: 'CAT-007', designation: 'VIP', description: 'Services exclusifs et personnalisés', statut: 'Inactif' },
  ];

  filteredCategories: Categorie[] = [...this.categories];
  searchTerm = '';
  filterStatut = '';
  showFilterDropdown = false;
  showModal = false;
  showViewModal = false;
  showDeleteConfirm = false;
  isEditMode = false;
  newCategorie: Partial<Categorie> = { statut: 'Actif' };
  viewedCategorie: Categorie | null = null;
  categorieToDelete: Categorie | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  filterCategories(): void {
    this.filteredCategories = this.categories.filter((categorie) => {
      const matchesSearch =
        categorie.designation.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        categorie.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        categorie.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatut = this.filterStatut ? categorie.statut === this.filterStatut : true;
      return matchesSearch && matchesStatut;
    });
    this.cdr.detectChanges();
  }

  toggleFilterDropdown(): void {
    this.showFilterDropdown = !this.showFilterDropdown;
    this.cdr.detectChanges();
  }

  toggleStatut(categorie: Categorie): void {
    categorie.statut = categorie.statut === 'Actif' ? 'Inactif' : 'Actif';
    this.filterCategories();
    this.cdr.detectChanges();
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.newCategorie = { statut: 'Actif', designation: '', description: '' };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  openEditModal(categorie: Categorie): void {
    this.isEditMode = true;
    this.newCategorie = { ...categorie };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.newCategorie = { statut: 'Actif' };
    this.cdr.detectChanges();
  }

  saveCategorie(): void {
    if (this.isEditMode) {
      const index = this.categories.findIndex((c) => c.code === (this.newCategorie as Categorie).code);
      if (index !== -1) {
        this.categories[index] = { ...this.newCategorie } as Categorie;
      }
    } else {
      const newCategorie: Categorie = {
        ...this.newCategorie,
        code: `CAT-${String(this.categories.length + 1).padStart(3, '0')}`,
      } as Categorie;
      this.categories.push(newCategorie);
    }
    this.filteredCategories = [...this.categories];
    this.closeModal();
  }

  voirCategorie(categorie: Categorie): void {
    this.viewedCategorie = categorie;
    this.showViewModal = true;
    this.cdr.detectChanges();
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.viewedCategorie = null;
    this.cdr.detectChanges();
  }

  confirmDeleteCategorie(categorie: Categorie): void {
    this.categorieToDelete = categorie;
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.categorieToDelete = null;
    this.cdr.detectChanges();
  }

  supprimerCategorie(): void {
    if (this.categorieToDelete) {
      this.categories = this.categories.filter((c) => c.code !== this.categorieToDelete!.code);
      this.filteredCategories = [...this.categories];
      this.cancelDelete();
    }
  }
}