import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface Adherent {
  code: string;
  nom: string;
  prenom: string;
  profession: string;
  email: string;
  adresse: string;
  tel1: string;
  tel2?: string;
  dateNaissance: string;
  cin: string;
  codeTVA?: string;
  raisonSoc?: string;
  idPointage?: string;
  societeCode: string;
}

@Component({
  selector: 'app-adherent',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './adherent.component.html',
  styleUrls: ['./adherent.component.scss'],
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
export class AdherentComponent {
  adherents: Adherent[] = [
    {
      code: 'ADH-001',
      nom: 'Dupont',
      prenom: 'Martin',
      profession: 'Ingénieur',
      email: 'martin.dupont@email.com',
      adresse: '123 Rue de Paris, 75001 Paris',
      tel1: '0612345678',
      tel2: '0712345678',
      dateNaissance: '1985-05-15',
      cin: '12345678',
      codeTVA: 'FR123456789',
      raisonSoc: 'Dupont SARL',
      idPointage: 'PTG-001',
      societeCode: 'SOC-001',
    },
    {
      code: 'ADH-002',
      nom: 'Laurent',
      prenom: 'Sophie',
      profession: 'Médecin',
      email: 'sophie.laurent@email.com',
      adresse: '45 Avenue des Champs, 75008 Paris',
      tel1: '0698765432',
      dateNaissance: '1990-03-22',
      cin: '87654321',
      societeCode: 'SOC-002',
    },
    {
      code: 'ADH-003',
      nom: 'Dubois',
      prenom: 'Lucas',
      profession: 'Avocat',
      email: 'lucas.dubois@email.com',
      adresse: '78 Boulevard Saint-Germain, 75005 Paris',
      tel1: '0654321987',
      tel2: '0754321987',
      dateNaissance: '1988-11-10',
      cin: '11223344',
      idPointage: 'PTG-003',
      societeCode: 'SOC-003',
    },
    {
      code: 'ADH-004',
      nom: 'Bernard',
      prenom: 'Emma',
      profession: 'Architecte',
      email: 'emma.bernard@email.com',
      adresse: '12 Rue de Lyon, 69003 Lyon',
      tel1: '0678901234',
      dateNaissance: '1995-07-19',
      cin: '44332211',
      societeCode: 'SOC-004',
    },
    {
      code: 'ADH-005',
      nom: 'Moreau',
      prenom: 'Pierre',
      profession: 'Professeur',
      email: 'pierre.moreau@email.com',
      adresse: '56 Rue Victor Hugo, 33000 Bordeaux',
      tel1: '0712345678',
      tel2: '0812345678',
      dateNaissance: '1975-01-30',
      cin: '55667788',
      codeTVA: 'FR987654321',
      raisonSoc: 'Moreau Consulting',
      societeCode: 'SOC-005',
    },
    {
      code: 'ADH-006',
      nom: 'Lefebvre',
      prenom: 'Julie',
      profession: 'Designer',
      email: 'julie.lefebvre@email.com',
      adresse: '89 Avenue de la République, 75011 Paris',
      tel1: '0687654321',
      dateNaissance: '1992-09-05',
      cin: '99887766',
      societeCode: 'SOC-006',
    },
    {
      code: 'ADH-007',
      nom: 'Girard',
      prenom: 'Thomas',
      profession: 'Consultant',
      email: 'thomas.girard@email.com',
      adresse: '34 Rue de Marseille, 13001 Marseille',
      tel1: '0623456789',
      tel2: '0723456789',
      dateNaissance: '1980-12-25',
      cin: '66778899',
      idPointage: 'PTG-007',
      societeCode: 'SOC-007',
    },
  ];

  filteredAdherents: Adherent[] = [...this.adherents];
  searchQuery = '';
  filterProfession = '';
  showFilter = false;
  showModal = false;
  showViewModal = false;
  showDeleteConfirm = false;
  isEditing = false;
  currentAdherent: Partial<Adherent> = {};
  viewedAdherent: Adherent | null = null;
  adherentToDelete: Adherent | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  filterAdherents(): void {
    this.filteredAdherents = this.adherents.filter((adherent) => {
      const matchesSearch =
        (adherent.code?.toLowerCase().includes(this.searchQuery.toLowerCase()) || '') ||
        (adherent.nom?.toLowerCase().includes(this.searchQuery.toLowerCase()) || '') ||
        (adherent.prenom?.toLowerCase().includes(this.searchQuery.toLowerCase()) || '') ||
        (adherent.email?.toLowerCase().includes(this.searchQuery.toLowerCase()) || '') ||
        (adherent.adresse?.toLowerCase().includes(this.searchQuery.toLowerCase()) || '') ||
        (adherent.tel1?.toLowerCase().includes(this.searchQuery.toLowerCase()) || '') ||
        (adherent.tel2?.toLowerCase().includes(this.searchQuery.toLowerCase()) || '') ||
        (adherent.dateNaissance?.toLowerCase().includes(this.searchQuery.toLowerCase()) || '') ||
        (adherent.cin?.toLowerCase().includes(this.searchQuery.toLowerCase()) || '') ||
        (adherent.codeTVA?.toLowerCase().includes(this.searchQuery.toLowerCase()) || '') ||
        (adherent.raisonSoc?.toLowerCase().includes(this.searchQuery.toLowerCase()) || '') ||
        (adherent.idPointage?.toLowerCase().includes(this.searchQuery.toLowerCase()) || '') ||
        (adherent.societeCode?.toLowerCase().includes(this.searchQuery.toLowerCase()) || '') ||
        (adherent.profession?.toLowerCase().includes(this.searchQuery.toLowerCase()) || '');
      const matchesProfession = this.filterProfession ? adherent.profession === this.filterProfession : true;
      return matchesSearch && matchesProfession;
    });
    this.cdr.detectChanges();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
    this.cdr.detectChanges();
  }

  openAddAdherentModal(): void {
    this.isEditing = false;
    this.currentAdherent = {
      code: `ADH-${(this.adherents.length + 1).toString().padStart(3, '0')}`,
      nom: '',
      prenom: '',
      profession: '',
      email: '',
      adresse: '',
      tel1: '',
      dateNaissance: '',
      cin: '',
      societeCode: '',
    };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  openEditAdherentModal(adherent: Adherent): void {
    this.isEditing = true;
    this.currentAdherent = { ...adherent };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.currentAdherent = {};
    this.cdr.detectChanges();
  }

  saveAdherent(): void {
    if (this.isEditing) {
      const index = this.adherents.findIndex((a) => a.code === (this.currentAdherent as Adherent).code);
      if (index !== -1) {
        this.adherents[index] = { ...this.currentAdherent } as Adherent;
      }
    } else {
      this.adherents.push({ ...this.currentAdherent } as Adherent);
    }
    this.filteredAdherents = [...this.adherents];
    this.closeModal();
  }

  viewAdherent(adherent: Adherent): void {
    this.viewedAdherent = adherent;
    this.showViewModal = true;
    this.cdr.detectChanges();
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.viewedAdherent = null;
    this.cdr.detectChanges();
  }

  confirmDeleteAdherent(adherent: Adherent): void {
    this.adherentToDelete = adherent;
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.adherentToDelete = null;
    this.cdr.detectChanges();
  }

  deleteAdherent(): void {
    if (this.adherentToDelete) {
      this.adherents = this.adherents.filter((a) => a.code !== this.adherentToDelete!.code);
      this.filteredAdherents = [...this.adherents];
      this.cancelDelete();
    }
  }
}