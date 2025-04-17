import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface ModaliteReg {
  codeMod: string;
  designationMod: string;
}

@Component({
  selector: 'app-module-reglement',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './module-reglement.component.html',
  styleUrls: ['./module-reglement.component.scss'],
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
export class ModuleReglementComponent {
  modaliteRegs: ModaliteReg[] = [
    { codeMod: 'MOD-001', designationMod: 'Carte bancaire' },
    { codeMod: 'MOD-002', designationMod: 'Virement' },
    { codeMod: 'MOD-003', designationMod: 'Espèces' },
    { codeMod: 'MOD-004', designationMod: 'Chèque' },
  ];

  filteredModalites: ModaliteReg[] = [...this.modaliteRegs];
  searchQuery = '';
  showModal = false;
  showViewModal = false;
  showDeleteConfirm = false;
  isEditing = false;
  currentModalite: Partial<ModaliteReg> = {};
  viewedModalite: ModaliteReg | null = null;
  modaliteToDelete: ModaliteReg | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  filterModalites(): void {
    this.filteredModalites = this.modaliteRegs.filter((modalite) => {
      const matchesSearch =
        modalite.codeMod.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        modalite.designationMod.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesSearch;
    });
    this.cdr.detectChanges();
  }

  openAddModal(): void {
    this.isEditing = false;
    this.currentModalite = {
      codeMod: `MOD-${String(this.modaliteRegs.length + 1).padStart(3, '0')}`,
      designationMod: '',
    };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  openEditModal(modalite: ModaliteReg): void {
    this.isEditing = true;
    this.currentModalite = { ...modalite };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.currentModalite = {};
    this.cdr.detectChanges();
  }

  saveModalite(): void {
    if (this.isEditing) {
      const index = this.modaliteRegs.findIndex((m) => m.codeMod === (this.currentModalite as ModaliteReg).codeMod);
      if (index !== -1) {
        this.modaliteRegs[index] = { ...this.currentModalite } as ModaliteReg;
      }
    } else {
      this.modaliteRegs.push({ ...this.currentModalite } as ModaliteReg);
    }
    this.filteredModalites = [...this.modaliteRegs];
    this.closeModal();
  }

  viewModalite(modalite: ModaliteReg): void {
    this.viewedModalite = modalite;
    this.showViewModal = true;
    this.cdr.detectChanges();
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.viewedModalite = null;
    this.cdr.detectChanges();
  }

  confirmDeleteModalite(modalite: ModaliteReg): void {
    this.modaliteToDelete = modalite;
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.modaliteToDelete = null;
    this.cdr.detectChanges();
  }

  deleteModalite(): void {
    if (this.modaliteToDelete) {
      this.modaliteRegs = this.modaliteRegs.filter((m) => m.codeMod !== this.modaliteToDelete!.codeMod);
      this.filteredModalites = [...this.modaliteRegs];
      this.cancelDelete();
    }
  }
}