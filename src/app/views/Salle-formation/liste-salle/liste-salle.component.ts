import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface Salle {
  code: string;
  designation: string;
  capacite: number;
  prixHeure: number;
  prixJour: number;
  statut: 'Disponible' | 'Réservée' | 'Maintenance';
}

@Component({
  selector: 'app-liste-salle',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './liste-salle.component.html',
  styleUrls: ['./liste-salle.component.scss'],
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
export class ListeSalleComponent {
  searchQuery = '';
  filterStatut = '';
  showFilter = false;
  showModal = false;
  showViewModal = false;
  showDeleteConfirm = false;
  isEditing = false;
  salleToDelete: Salle | null = null;
  viewedSalle: Salle | null = null;

  salles: Salle[] = [
    {
      code: 'SALLE-001',
      designation: 'Salle A - Yoga',
      capacite: 20,
      prixHeure: 35,
      prixJour: 250,
      statut: 'Disponible',
    },
    {
      code: 'SALLE-002',
      designation: 'Salle B - Musculation',
      capacite: 20,
      prixHeure: 40,
      prixJour: 280,
      statut: 'Disponible',
    },
    {
      code: 'SALLE-003',
      designation: 'Salle C - Cardio',
      capacite: 20,
      prixHeure: 35,
      prixJour: 250,
      statut: 'Disponible',
    },
    {
      code: 'SALLE-004',
      designation: 'Salle D - Pilates',
      capacite: 15,
      prixHeure: 40,
      prixJour: 280,
      statut: 'Réservée',
    },
    {
      code: 'SALLE-005',
      designation: 'Salle E - CrossFit',
      capacite: 10,
      prixHeure: 45,
      prixJour: 300,
      statut: 'Disponible',
    },
    {
      code: 'SALLE-006',
      designation: 'Salle F - Danse',
      capacite: 25,
      prixHeure: 38,
      prixJour: 270,
      statut: 'Réservée',
    },
    {
      code: 'SALLE-007',
      designation: 'Salle G - Spinning',
      capacite: 18,
      prixHeure: 42,
      prixJour: 290,
      statut: 'Maintenance',
    },
  ];

  filteredSalles: Salle[] = [...this.salles];
  currentSalle: Partial<Salle> = this.resetSalle();

  constructor(private cdr: ChangeDetectorRef) {}

  resetSalle(): Partial<Salle> {
    return {
      code: '',
      designation: '',
      capacite: 0,
      prixHeure: 0,
      prixJour: 0,
      statut: 'Disponible',
    };
  }

  filterSalles(): void {
    this.filteredSalles = this.salles.filter((salle) => {
      const query = this.searchQuery.toLowerCase();
      const matchesSearch =
        salle.code.toLowerCase().includes(query) ||
        salle.designation.toLowerCase().includes(query);
      const matchesStatut = this.filterStatut ? salle.statut === this.filterStatut : true;
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

  openAddSalleModal(): void {
    this.isEditing = false;
    this.currentSalle = this.resetSalle();
    this.currentSalle.code = `SALLE-${(this.salles.length + 1).toString().padStart(3, '0')}`;
    this.showModal = true;
    this.cdr.detectChanges();
  }

  openEditSalleModal(salle: Salle): void {
    this.isEditing = true;
    this.currentSalle = { ...salle };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.currentSalle = this.resetSalle();
    this.cdr.detectChanges();
  }

  saveSalle(): void {
    if (this.isEditing) {
      const index = this.salles.findIndex((s) => s.code === this.currentSalle.code);
      if (index !== -1) {
        this.salles[index] = { ...this.currentSalle } as Salle;
      }
    } else {
      this.salles.push({ ...this.currentSalle } as Salle);
    }
    this.filteredSalles = [...this.salles];
    this.closeModal();
  }

  viewSalle(salle: Salle): void {
    this.viewedSalle = salle;
    this.showViewModal = true;
    this.cdr.detectChanges();
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.viewedSalle = null;
    this.cdr.detectChanges();
  }

  confirmDeleteSalle(salle: Salle): void {
    this.salleToDelete = salle;
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }

  deleteSalle(): void {
    if (this.salleToDelete) {
      this.salles = this.salles.filter((s) => s.code !== this.salleToDelete!.code);
      this.filteredSalles = [...this.salles];
      this.cancelDelete();
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.salleToDelete = null;
    this.cdr.detectChanges();
  }
}