import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface Salle {
  codeSalle: string;
  designationSalle: string;
  capaciteSalle: number;
  prixHeureSalle: number;
  prixJourSalle: number;
  created_at?: string;
  updated_at?: string;
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
  showFilter = false;
  showModal = false;
  showViewModal = false;
  showDeleteConfirm = false;
  isEditing = false;
  salleToDelete: Salle | null = null;
  viewedSalle: Salle | null = null;

  salles: Salle[] = [
    {
      codeSalle: 'SALLE-001',
      designationSalle: 'Salle A - Yoga',
      capaciteSalle: 20,
      prixHeureSalle: 35,
      prixJourSalle: 250,
      created_at: '2025-01-01 10:00:00',
      updated_at: '2025-01-02 15:30:00',
    },
    {
      codeSalle: 'SALLE-002',
      designationSalle: 'Salle B - Musculation',
      capaciteSalle: 20,
      prixHeureSalle: 40,
      prixJourSalle: 280,
      created_at: '2025-02-01 09:00:00',
      updated_at: '2025-02-03 14:20:00',
    },
    {
      codeSalle: 'SALLE-003',
      designationSalle: 'Salle C - Cardio',
      capaciteSalle: 20,
      prixHeureSalle: 35,
      prixJourSalle: 250,
      created_at: '2025-03-01 11:00:00',
      updated_at: '2025-03-01 11:00:00',
    },
    {
      codeSalle: 'SALLE-004',
      designationSalle: 'Salle D - Pilates',
      capaciteSalle: 15,
      prixHeureSalle: 40,
      prixJourSalle: 280,
      created_at: '2025-04-01 08:30:00',
      updated_at: '2025-04-02 16:00:00',
    },
    {
      codeSalle: 'SALLE-005',
      designationSalle: 'Salle E - CrossFit',
      capaciteSalle: 10,
      prixHeureSalle: 45,
      prixJourSalle: 300,
      created_at: '2025-05-01 12:00:00',
      updated_at: '2025-05-01 12:00:00',
    },
    {
      codeSalle: 'SALLE-006',
      designationSalle: 'Salle F - Danse',
      capaciteSalle: 25,
      prixHeureSalle: 38,
      prixJourSalle: 270,
      created_at: '2025-06-01 10:00:00',
      updated_at: '2025-06-02 13:45:00',
    },
    {
      codeSalle: 'SALLE-007',
      designationSalle: 'Salle G - Spinning',
      capaciteSalle: 18,
      prixHeureSalle: 42,
      prixJourSalle: 290,
      created_at: '2025-07-01 09:00:00',
      updated_at: '2025-07-01 09:00:00',
    },
  ];

  filteredSalles: Salle[] = [...this.salles];
  currentSalle: Partial<Salle> = this.resetSalle();

  constructor(private cdr: ChangeDetectorRef) {}

  resetSalle(): Partial<Salle> {
    return {
      codeSalle: '',
      designationSalle: '',
      capaciteSalle: 0,
      prixHeureSalle: 0,
      prixJourSalle: 0,
    };
  }

  filterSalles(): void {
    this.filteredSalles = this.salles.filter((salle) => {
      const query = this.searchQuery.toLowerCase();
      return (
        salle.codeSalle.toLowerCase().includes(query) ||
        salle.designationSalle.toLowerCase().includes(query)
      );
    });
    this.cdr.detectChanges();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
    this.cdr.detectChanges();
  }

  openAddSalleModal(): void {
    this.isEditing = false;
    this.currentSalle = this.resetSalle();
    this.currentSalle.codeSalle = `SALLE-${(this.salles.length + 1).toString().padStart(3, '0')}`;
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
    const now = new Date().toISOString().replace('T', ' ').split('.')[0];
    if (this.isEditing) {
      const index = this.salles.findIndex((s) => s.codeSalle === this.currentSalle.codeSalle);
      if (index !== -1) {
        this.salles[index] = {
          ...this.currentSalle,
          updated_at: now,
          created_at: this.salles[index].created_at, // Preserve original created_at
        } as Salle;
      }
    } else {
      this.salles.push({
        ...this.currentSalle,
        created_at: now,
        updated_at: now,
      } as Salle);
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
      this.salles = this.salles.filter((s) => s.codeSalle !== this.salleToDelete!.codeSalle);
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