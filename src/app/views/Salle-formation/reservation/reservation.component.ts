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

interface Formateur {
  code: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  specialite: string;
  statut: 'Actif' | 'Inactif';
}

interface Reservation {
  id: string;
  date: string;
  horaire: string;
  salleCode: string;
  formateurCode: string;
  montant: number;
  participants: string;
  statut: 'À venir' | 'Terminée';
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
  filterStatut = '';
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

  reservations: Reservation[] = [
    {
      id: 'RES-001',
      date: '2025-04-09',
      horaire: '10:00 - 11:30',
      salleCode: 'SALLE-001',
      formateurCode: 'FOR-001',
      montant: 35,
      participants: '15/20',
      statut: 'À venir',
    },
    {
      id: 'RES-002',
      date: '2025-04-09',
      horaire: '14:00 - 15:30',
      salleCode: 'SALLE-002',
      formateurCode: 'FOR-002',
      montant: 40,
      participants: '10/15',
      statut: 'À venir',
    },
    {
      id: 'RES-003',
      date: '2025-04-09',
      horaire: '17:00 - 18:30',
      salleCode: 'SALLE-003',
      formateurCode: 'FOR-003',
      montant: 35,
      participants: '18/20',
      statut: 'À venir',
    },
    {
      id: 'RES-004',
      date: '2025-04-10',
      horaire: '10:00 - 11:30',
      salleCode: 'SALLE-001',
      formateurCode: 'FOR-001',
      montant: 35,
      participants: '8/20',
      statut: 'À venir',
    },
    {
      id: 'RES-005',
      date: '2025-04-10',
      horaire: '18:00 - 19:30',
      salleCode: 'SALLE-004',
      formateurCode: 'FOR-004',
      montant: 40,
      participants: '10/15',
      statut: 'À venir',
    },
    {
      id: 'RES-006',
      date: '2025-04-08',
      horaire: '14:00 - 15:30',
      salleCode: 'SALLE-005',
      formateurCode: 'FOR-005',
      montant: 45,
      participants: '8/10',
      statut: 'Terminée',
    },
    {
      id: 'RES-007',
      date: '2025-04-08',
      horaire: '18:00 - 19:30',
      salleCode: 'SALLE-006',
      formateurCode: 'FOR-006',
      montant: 38,
      participants: '22/25',
      statut: 'Terminée',
    },
  ];

  filteredReservations: Reservation[] = [...this.reservations];
  currentReservation: Partial<Reservation> = this.resetReservation();

  constructor(private cdr: ChangeDetectorRef) {}

  resetReservation(): Partial<Reservation> {
    return {
      id: '',
      date: this.today,
      horaire: '',
      salleCode: this.salles[0]?.code || '',
      formateurCode: this.formateurs[0]?.code || '',
      montant: 0,
      participants: '',
      statut: 'À venir',
    };
  }

  filterReservations(): void {
    this.filteredReservations = this.reservations.filter((reservation) => {
      const query = this.searchQuery.toLowerCase();
      const salle = this.salles.find((s) => s.code === reservation.salleCode);
      const formateur = this.formateurs.find((f) => f.code === reservation.formateurCode);
      const matchesSearch =
        reservation.id.toLowerCase().includes(query) ||
        reservation.date.toLowerCase().includes(query) ||
        reservation.horaire.toLowerCase().includes(query) ||
        (salle?.designation || '').toLowerCase().includes(query) ||
        `${formateur?.nom || ''} ${formateur?.prenom || ''}`.toLowerCase().includes(query) ||
        reservation.participants.toLowerCase().includes(query);
      const matchesSalle = this.filterSalleCode ? reservation.salleCode === this.filterSalleCode : true;
      const matchesStatut = this.filterStatut ? reservation.statut === this.filterStatut : true;
      return matchesSearch && matchesSalle && matchesStatut;
    });
    this.cdr.detectChanges();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
    this.cdr.detectChanges();
  }

  getStatutClass(statut: string | undefined): string {
    return statut ? statut.replace(' ', '-') : '';
  }

  getSalleDesignation(salleCode: string | undefined): string {
    const salle = this.salles.find((s) => s.code === salleCode);
    return salle ? salle.designation : 'N/A';
  }

  getFormateurName(formateurCode: string | undefined): string {
    const formateur = this.formateurs.find((f) => f.code === formateurCode);
    return formateur ? `${formateur.nom} ${formateur.prenom}` : 'N/A';
  }

  updateMontant(): void {
    const salle = this.salles.find((s) => s.code === this.currentReservation.salleCode);
    if (salle) {
      const [start, end] = (this.currentReservation.horaire || '00:00 - 00:00').split(' - ').map((time) => {
        const [h, m] = time.split(':').map(Number);
        return h + m / 60;
      });
      const hours = end - start;
      this.currentReservation.montant = hours > 0 ? Number((salle.prixHeure * hours).toFixed(2)) : salle.prixHeure;
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
    if (this.isEditing) {
      const index = this.reservations.findIndex((r) => r.id === this.currentReservation.id);
      if (index !== -1) {
        this.reservations[index] = { ...this.currentReservation } as Reservation;
      }
    } else {
      this.reservations.push({ ...this.currentReservation } as Reservation);
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