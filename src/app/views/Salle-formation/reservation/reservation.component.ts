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
}

interface Formateur {
  codeFor: string;
  nomFor: string;
  prenomFor: string;
  telFor: string;
  emailFor: string;
  adrFor: string;
}

interface Reservation {
  id: string;
  dateReservation: string;
  montantReservation: number;
  codeSalle: string;
  codeFor: string;
  created_at?: string;
  updated_at?: string;
}

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
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
export class ReservationComponent {
  searchQuery = '';
  filterSalleCode = '';
  showFilter = false;
  showModal = false;
  showViewModal = false;
  showDeleteConfirm = false;
  isEditing = false;
  reservationToDelete: Reservation | null = null;
  viewedReservation: Reservation | null = null;
  today = new Date().toISOString().split('T')[0];

  salles: Salle[] = [
    {
      codeSalle: 'SALLE-001',
      designationSalle: 'Salle A - Yoga',
      capaciteSalle: 20,
      prixHeureSalle: 35,
      prixJourSalle: 250,
    },
    {
      codeSalle: 'SALLE-002',
      designationSalle: 'Salle B - Musculation',
      capaciteSalle: 20,
      prixHeureSalle: 40,
      prixJourSalle: 280,
    },
    {
      codeSalle: 'SALLE-003',
      designationSalle: 'Salle C - Cardio',
      capaciteSalle: 20,
      prixHeureSalle: 35,
      prixJourSalle: 250,
    },
    {
      codeSalle: 'SALLE-004',
      designationSalle: 'Salle D - Pilates',
      capaciteSalle: 15,
      prixHeureSalle: 40,
      prixJourSalle: 280,
    },
    {
      codeSalle: 'SALLE-005',
      designationSalle: 'Salle E - CrossFit',
      capaciteSalle: 10,
      prixHeureSalle: 45,
      prixJourSalle: 300,
    },
    {
      codeSalle: 'SALLE-006',
      designationSalle: 'Salle F - Danse',
      capaciteSalle: 25,
      prixHeureSalle: 38,
      prixJourSalle: 270,
    },
    {
      codeSalle: 'SALLE-007',
      designationSalle: 'Salle G - Spinning',
      capaciteSalle: 18,
      prixHeureSalle: 42,
      prixJourSalle: 290,
    },
  ];

  formateurs: Formateur[] = [
    {
      codeFor: 'FOR-001',
      nomFor: 'Leroy',
      prenomFor: 'Marie',
      telFor: '0612345678',
      emailFor: 'marie.leroy@email.com',
      adrFor: '123 Rue de Paris, 75001 Paris',
    },
    {
      codeFor: 'FOR-002',
      nomFor: 'Girard',
      prenomFor: 'Thomas',
      telFor: '0698765432',
      emailFor: 'thomas.girard@email.com',
      adrFor: '456 Avenue des Champs, 75008 Paris',
    },
    {
      codeFor: 'FOR-003',
      nomFor: 'Petit',
      prenomFor: 'Julie',
      telFor: '0654321987',
      emailFor: 'julie.petit@email.com',
      adrFor: '789 Boulevard St-Germain, 75006 Paris',
    },
    {
      codeFor: 'FOR-004',
      nomFor: 'Blanc',
      prenomFor: 'Sophie',
      telFor: '0678901234',
      emailFor: 'sophie.blanc@email.com',
      adrFor: '321 Rue de Lyon, 69003 Lyon',
    },
    {
      codeFor: 'FOR-005',
      nomFor: 'Martin',
      prenomFor: 'Lucas',
      telFor: '0712345678',
      emailFor: 'lucas.martin@email.com',
      adrFor: '654 Avenue de la Mer, 13001 Marseille',
    },
    {
      codeFor: 'FOR-006',
      nomFor: 'Rousseau',
      prenomFor: 'Emma',
      telFor: '0687654321',
      emailFor: 'emma.rousseau@email.com',
      adrFor: '987 Rue du Nord, 59000 Lille',
    },
  ];

  reservations: Reservation[] = [
    {
      id: 'RES-001',
      dateReservation: '2025-04-09',
      montantReservation: 250,
      codeSalle: 'SALLE-001',
      codeFor: 'FOR-001',
      created_at: '2025-04-01 10:00:00',
      updated_at: '2025-04-01 10:00:00',
    },
    {
      id: 'RES-002',
      dateReservation: '2025-04-09',
      montantReservation: 280,
      codeSalle: 'SALLE-002',
      codeFor: 'FOR-002',
      created_at: '2025-04-01 11:00:00',
      updated_at: '2025-04-01 11:00:00',
    },
    {
      id: 'RES-003',
      dateReservation: '2025-04-09',
      montantReservation: 250,
      codeSalle: 'SALLE-003',
      codeFor: 'FOR-003',
      created_at: '2025-04-01 12:00:00',
      updated_at: '2025-04-01 12:00:00',
    },
    {
      id: 'RES-004',
      dateReservation: '2025-04-10',
      montantReservation: 250,
      codeSalle: 'SALLE-001',
      codeFor: 'FOR-001',
      created_at: '2025-04-02 09:00:00',
      updated_at: '2025-04-02 09:00:00',
    },
    {
      id: 'RES-005',
      dateReservation: '2025-04-10',
      montantReservation: 280,
      codeSalle: 'SALLE-004',
      codeFor: 'FOR-004',
      created_at: '2025-04-02 10:00:00',
      updated_at: '2025-04-02 10:00:00',
    },
    {
      id: 'RES-006',
      dateReservation: '2025-04-08',
      montantReservation: 300,
      codeSalle: 'SALLE-005',
      codeFor: 'FOR-005',
      created_at: '2025-03-31 14:00:00',
      updated_at: '2025-03-31 14:00:00',
    },
    {
      id: 'RES-007',
      dateReservation: '2025-04-08',
      montantReservation: 270,
      codeSalle: 'SALLE-006',
      codeFor: 'FOR-006',
      created_at: '2025-03-31 15:00:00',
      updated_at: '2025-03-31 15:00:00',
    },
  ];

  filteredReservations: Reservation[] = [...this.reservations];
  currentReservation: Partial<Reservation> = this.resetReservation();

  constructor(private cdr: ChangeDetectorRef) {}

  resetReservation(): Partial<Reservation> {
    return {
      id: '',
      dateReservation: this.today,
      montantReservation: 0,
      codeSalle: this.salles[0]?.codeSalle || '',
      codeFor: this.formateurs[0]?.codeFor || '',
    };
  }

  filterReservations(): void {
    this.filteredReservations = this.reservations.filter((reservation) => {
      const query = this.searchQuery.toLowerCase();
      const salle = this.salles.find((s) => s.codeSalle === reservation.codeSalle);
      const formateur = this.formateurs.find((f) => f.codeFor === reservation.codeFor);
      const matchesSearch =
        reservation.id.toLowerCase().includes(query) ||
        reservation.dateReservation.toLowerCase().includes(query) ||
        (salle?.designationSalle || '').toLowerCase().includes(query) ||
        `${formateur?.nomFor || ''} ${formateur?.prenomFor || ''}`.toLowerCase().includes(query);
      const matchesSalle = this.filterSalleCode ? reservation.codeSalle === this.filterSalleCode : true;
      return matchesSearch && matchesSalle;
    });
    this.cdr.detectChanges();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
    this.cdr.detectChanges();
  }

  getSalleDesignation(codeSalle: string | undefined): string {
    const salle = this.salles.find((s) => s.codeSalle === codeSalle);
    return salle ? salle.designationSalle : 'N/A';
  }

  getFormateurName(codeFor: string | undefined): string {
    const formateur = this.formateurs.find((f) => f.codeFor === codeFor);
    return formateur ? `${formateur.nomFor} ${formateur.prenomFor}` : 'N/A';
  }

  updateMontant(): void {
    const salle = this.salles.find((s) => s.codeSalle === this.currentReservation.codeSalle);
    if (salle) {
      // Since horaire is removed, assume a full-day reservation for simplicity
      this.currentReservation.montantReservation = salle.prixJourSalle;
    }
  }

  openAddReservationModal(): void {
    this.isEditing = false;
    this.currentReservation = this.resetReservation();
    this.currentReservation.id = `RES-${(this.reservations.length + 1).toString().padStart(3, '0')}`;
    this.showModal = true;
    this.updateMontant();
    this.cdr.detectChanges();
  }

  openEditReservationModal(reservation: Reservation): void {
    this.isEditing = true;
    this.currentReservation = { ...reservation };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.currentReservation = this.resetReservation();
    this.cdr.detectChanges();
  }

  saveReservation(): void {
    const now = new Date().toISOString().replace('T', ' ').split('.')[0];
    if (this.isEditing) {
      const index = this.reservations.findIndex((r) => r.id === this.currentReservation.id);
      if (index !== -1) {
        this.reservations[index] = {
          ...this.currentReservation,
          updated_at: now,
          created_at: this.reservations[index].created_at, // Preserve original created_at
        } as Reservation;
      }
    } else {
      this.reservations.push({
        ...this.currentReservation,
        created_at: now,
        updated_at: now,
      } as Reservation);
    }
    this.filteredReservations = [...this.reservations];
    this.closeModal();
  }

  viewReservation(reservation: Reservation): void {
    this.viewedReservation = reservation;
    this.showViewModal = true;
    this.cdr.detectChanges();
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.viewedReservation = null;
    this.cdr.detectChanges();
  }

  confirmDeleteReservation(reservation: Reservation): void {
    this.reservationToDelete = reservation;
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }

  deleteReservation(): void {
    if (this.reservationToDelete) {
      this.reservations = this.reservations.filter((r) => r.id !== this.reservationToDelete!.id);
      this.filteredReservations = [...this.reservations];
      this.cancelDelete();
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.reservationToDelete = null;
    this.cdr.detectChanges();
  }
}