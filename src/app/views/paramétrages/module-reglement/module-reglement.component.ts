import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface Payment {
  code: string;
  date: string;
  mode: 'Carte bancaire' | 'Virement' | 'Espèces' | 'Chèque';
  amount: number;
  status: 'Réussi' | 'En cours' | 'Echoué' | 'En attente';
  comment: string;
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
    { code: 'REG-001', date: '2025-04-05', mode: 'Carte bancaire', amount: 59.99, status: 'Réussi', comment: 'Paiement mensuel' },
    { code: 'REG-002', date: '2025-04-01', mode: 'Virement', amount: 499.99, status: 'Réussi', comment: 'Abonnement annuel' },
    { code: 'REG-003', date: '2025-04-01', mode: 'Espèces', amount: 39.99, status: 'Réussi', comment: 'Paiement mensuel' },
    { code: 'REG-004', date: '2025-03-01', mode: 'Chèque', amount: 99.99, status: 'En cours', comment: 'Premier versement trimestriel' },
    { code: 'REG-005', date: '2025-03-25', mode: 'Carte bancaire', amount: 39.99, status: 'Réussi', comment: 'Paiement mensuel' },
    { code: 'REG-006', date: '2025-03-15', mode: 'Virement', amount: 39.99, status: 'Echoué', comment: 'Paiement mensuel' },
    { code: 'REG-007', date: '2025-03-10', mode: 'Carte bancaire', amount: 59.99, status: 'En attente', comment: 'Paiement mensuel' },
  ];

  filteredPayments: Payment[] = [...this.payments];
  searchQuery = '';
  filterMode = '';
  filterStatus = '';
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
        payment.code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        payment.date.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        payment.mode.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (payment.comment && payment.comment.toLowerCase().includes(this.searchQuery.toLowerCase()));
      const matchesMode = this.filterMode ? payment.mode === this.filterMode : true;
      const matchesStatus = this.filterStatus ? payment.status === this.filterStatus : true;
      return matchesSearch && matchesMode && matchesStatus;
    });
    this.cdr.detectChanges();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
    this.cdr.detectChanges();
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'Réussi':
        return 'Réussi';
      case 'En cours':
        return 'En-cours';
      case 'Echoué':
        return 'Echoué';
      case 'En attente':
        return 'En-attente';
      default:
        return '';
    }
  }

  openAddPaymentModal(): void {
    this.isEditing = false;
    this.currentPayment = {
      code: `REG-${(this.payments.length + 1).toString().padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      mode: 'Carte bancaire',
      amount: 0,
      status: 'Réussi',
      comment: '',
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
      const index = this.payments.findIndex((p) => p.code === (this.currentPayment as Payment).code);
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
      this.payments = this.payments.filter((p) => p.code !== this.paymentToDelete!.code);
      this.filteredPayments = [...this.payments];
      this.cancelDelete();
    }
  }
}