import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface Categorie {
  codeCateg: string;
  designationCateg: string;
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
    { codeCateg: 'CAT-001', designationCateg: 'Standard' },
    { codeCateg: 'CAT-002', designationCateg: 'Premium' },
    { codeCateg: 'CAT-003', designationCateg: 'Étudiant' },
    { codeCateg: 'CAT-004', designationCateg: 'Senior' },
    { codeCateg: 'CAT-005', designationCateg: 'Famille' },
    { codeCateg: 'CAT-006', designationCateg: 'Entreprise' },
    { codeCateg: 'CAT-007', designationCateg: 'VIP' },
  ];

  filteredCategories: Categorie[] = [...this.categories];
  searchTerm = '';
  showFilterDropdown = false;
  showModal = false;
  showViewModal = false;
  showDeleteConfirm = false;
  isEditMode = false;
  newCategorie: Partial<Categorie> = {};
  viewedCategorie: Categorie | null = null;
  categorieToDelete: Categorie | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  filterCategories(): void {
    this.filteredCategories = this.categories.filter((categorie) => {
      const matchesSearch =
        categorie.designationCateg.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        categorie.codeCateg.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesSearch;
    });
    this.cdr.detectChanges();
  }

  toggleFilterDropdown(): void {
    this.showFilterDropdown = !this.showFilterDropdown;
    this.cdr.detectChanges();
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.newCategorie = { designationCateg: '' };
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
    this.newCategorie = {};
    this.cdr.detectChanges();
  }

  saveCategorie(): void {
    if (this.isEditMode) {
      const index = this.categories.findIndex((c) => c.codeCateg === (this.newCategorie as Categorie).codeCateg);
      if (index !== -1) {
        this.categories[index] = { ...this.newCategorie } as Categorie;
      }
    } else {
      const newCategorie: Categorie = {
        ...this.newCategorie,
        codeCateg: `CAT-${String(this.categories.length + 1).padStart(3, '0')}`,
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
      this.categories = this.categories.filter((c) => c.codeCateg !== this.categorieToDelete!.codeCateg);
      this.filteredCategories = [...this.categories];
      this.cancelDelete();
    }
  }
}