import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface Payment {
  codeReg: string;
  dateReg: string;
  mtrReg: number;
  numChq: string | null;
  numTraite: string | null;
  commentaire: string | null;
  abonnementCodeAbo: string;
  modaliteRegCodeMod: string;
}

interface Abonnement {
  codeAbo: string;
}

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
  payments: Payment[] = [
    { codeReg: 'REG-001', dateReg: '2025-04-05', mtrReg: 59.99, numChq: null, numTraite: null, commentaire: 'Paiement mensuel', abonnementCodeAbo: 'ABO-001', modaliteRegCodeMod: 'MOD-001' },
    { codeReg: 'REG-002', dateReg: '2025-04-01', mtrReg: 499.99, numChq: null, numTraite: 'TRAITE-001', commentaire: 'Abonnement annuel', abonnementCodeAbo: 'ABO-002', modaliteRegCodeMod: 'MOD-002' },
    { codeReg: 'REG-003', dateReg: '2025-04-01', mtrReg: 39.99, numChq: null, numTraite: null, commentaire: 'Paiement mensuel', abonnementCodeAbo: 'ABO-003', modaliteRegCodeMod: 'MOD-003' },
    { codeReg: 'REG-004', dateReg: '2025-03-01', mtrReg: 99.99, numChq: 'CHQ-001', numTraite: null, commentaire: 'Premier versement trimestriel', abonnementCodeAbo: 'ABO-004', modaliteRegCodeMod: 'MOD-004' },
    { codeReg: 'REG-005', dateReg: '2025-03-25', mtrReg: 39.99, numChq: null, numTraite: null, commentaire: 'Paiement mensuel', abonnementCodeAbo: 'ABO-005', modaliteRegCodeMod: 'MOD-001' },
    { codeReg: 'REG-006', dateReg: '2025-03-15', mtrReg: 39.99, numChq: null, numTraite: 'TRAITE-002', commentaire: 'Paiement mensuel', abonnementCodeAbo: 'ABO-006', modaliteRegCodeMod: 'MOD-002' },
    { codeReg: 'REG-007', dateReg: '2025-03-10', mtrReg: 59.99, numChq: null, numTraite: null, commentaire: 'Paiement mensuel', abonnementCodeAbo: 'ABO-007', modaliteRegCodeMod: 'MOD-001' },
  ];

  abonnements: Abonnement[] = [
    { codeAbo: 'ABO-001' },
    { codeAbo: 'ABO-002' },
    { codeAbo: 'ABO-003' },
    { codeAbo: 'ABO-004' },
    { codeAbo: 'ABO-005' },
    { codeAbo: 'ABO-006' },
    { codeAbo: 'ABO-007' },
  ];

  modaliteRegs: ModaliteReg[] = [
    { codeMod: 'MOD-001', designationMod: 'Carte bancaire' },
    { codeMod: 'MOD-002', designationMod: 'Virement' },
    { codeMod: 'MOD-003', designationMod: 'Espèces' },
    { codeMod: 'MOD-004', designationMod: 'Chèque' },
  ];

  filteredPayments: Payment[] = [...this.payments];
  searchQuery = '';
  filterMode = '';
  showFilter = false;
  showModal = false;
  showViewModal = false;
  showDeleteConfirm = false;
  isEditing = false;
  currentPayment: Partial<Payment> = {};
  viewedPayment: Payment | null = null;
  paymentToDelete: Payment | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  filterPayments(): void {
    this.filteredPayments = this.payments.filter((payment) => {
      const matchesSearch =
        payment.codeReg.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        payment.dateReg.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        this.getModaliteRegDesignation(payment.modaliteRegCodeMod).toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (payment.commentaire && payment.commentaire.toLowerCase().includes(this.searchQuery.toLowerCase()));
      const matchesMode = this.filterMode ? payment.modaliteRegCodeMod === this.filterMode : true;
      return matchesSearch && matchesMode;
    });
    this.cdr.detectChanges();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
    this.cdr.detectChanges();
  }

  getModaliteRegDesignation(codeMod: string): string {
    const modalite = this.modaliteRegs.find((m) => m.codeMod === codeMod);
    return modalite ? modalite.designationMod : 'Inconnu';
  }

  openAddPaymentModal(): void {
    this.isEditing = false;
    this.currentPayment = {
      codeReg: `REG-${(this.payments.length + 1).toString().padStart(3, '0')}`,
      dateReg: new Date().toISOString().split('T')[0],
      mtrReg: 0,
      numChq: null,
      numTraite: null,
      commentaire: '',
      abonnementCodeAbo: this.abonnements[0]?.codeAbo || '',
      modaliteRegCodeMod: this.modaliteRegs[0]?.codeMod || '',
    };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  openEditPaymentModal(payment: Payment): void {
    this.isEditing = true;
    this.currentPayment = { ...payment };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.currentPayment = {};
    this.cdr.detectChanges();
  }

  savePayment(): void {
    if (this.isEditing) {
      const index = this.payments.findIndex((p) => p.codeReg === (this.currentPayment as Payment).codeReg);
      if (index !== -1) {
        this.payments[index] = { ...this.currentPayment } as Payment;
      }
    } else {
      this.payments.push({ ...this.currentPayment } as Payment);
    }
    this.filteredPayments = [...this.payments];
    this.closeModal();
  }

  viewPayment(payment: Payment): void {
    this.viewedPayment = payment;
    this.showViewModal = true;
    this.cdr.detectChanges();
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.viewedPayment = null;
    this.cdr.detectChanges();
  }

  confirmDeletePayment(payment: Payment): void {
    this.paymentToDelete = payment;
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.paymentToDelete = null;
    this.cdr.detectChanges();
  }

  deletePayment(): void {
    if (this.paymentToDelete) {
      this.payments = this.payments.filter((p) => p.codeReg !== this.paymentToDelete!.codeReg);
      this.filteredPayments = [...this.payments];
      this.cancelDelete();
    }
  }
}