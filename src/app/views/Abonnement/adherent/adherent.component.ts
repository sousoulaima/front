import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface Adherent {
  code: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  profession: 'Ingénieur' | 'Médecin' | 'Avocat' | 'Architecte' | 'Professeur' | 'Designer' | 'Consultant';
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
    { code: 'ADH-001', nom: 'Dupont', prenom: 'Martin', email: 'martin.dupont@email.com', telephone: '0612345678', profession: 'Ingénieur' },
    { code: 'ADH-002', nom: 'Laurent', prenom: 'Sophie', email: 'sophie.laurent@email.com', telephone: '0698765432', profession: 'Médecin' },
    { code: 'ADH-003', nom: 'Dubois', prenom: 'Lucas', email: 'lucas.dubois@email.com', telephone: '0654321987', profession: 'Avocat' },
    { code: 'ADH-004', nom: 'Bernard', prenom: 'Emma', email: 'emma.bernard@email.com', telephone: '0678901234', profession: 'Architecte' },
    { code: 'ADH-005', nom: 'Moreau', prenom: 'Pierre', email: 'pierre.moreau@email.com', telephone: '0712345678', profession: 'Professeur' },
    { code: 'ADH-006', nom: 'Lefebvre', prenom: 'Julie', email: 'julie.lefebvre@email.com', telephone: '0687654321', profession: 'Designer' },
    { code: 'ADH-007', nom: 'Girard', prenom: 'Thomas', email: 'thomas.girard@email.com', telephone: '0623456789', profession: 'Consultant' },
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
        adherent.code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        adherent.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        adherent.prenom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        adherent.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        adherent.telephone.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        adherent.profession.toLowerCase().includes(this.searchQuery.toLowerCase());
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
      email: '',
      telephone: '',
      profession: 'Ingénieur',
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