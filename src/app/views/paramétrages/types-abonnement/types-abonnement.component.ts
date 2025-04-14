import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface Subscription {
  code: string;
  designation: string;
  duration: number;
  price: number;
  freeAccess: boolean;
  weeklySessions: number;
  status: 'Actif' | 'Inactif';
}

@Component({
  selector: 'app-types-abonnement',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './types-abonnement.component.html',
  styleUrls: ['./types-abonnement.component.scss'],
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
export class TypesAbonnementComponent {
  subscriptions: Subscription[] = [
    { code: 'TYPE-001', designation: 'Mensuel Standard', duration: 1, price: 39.99, freeAccess: true, weeklySessions: 3, status: 'Actif' },
    { code: 'TYPE-002', designation: 'Mensuel Premium', duration: 1, price: 59.99, freeAccess: true, weeklySessions: -1, status: 'Actif' },
    { code: 'TYPE-003', designation: 'Trimestriel Standard', duration: 3, price: 109.99, freeAccess: true, weeklySessions: 3, status: 'Actif' },
    { code: 'TYPE-004', designation: 'Trimestriel Premium', duration: 3, price: 169.99, freeAccess: true, weeklySessions: -1, status: 'Actif' },
    { code: 'TYPE-005', designation: 'Annuel Standard', duration: 12, price: 399.99, freeAccess: true, weeklySessions: 3, status: 'Actif' },
    { code: 'TYPE-006', designation: 'Annuel Premium', duration: 12, price: 599.99, freeAccess: true, weeklySessions: -1, status: 'Actif' },
    { code: 'TYPE-007', designation: 'Pass Journée', duration: 0, price: 15.99, freeAccess: true, weeklySessions: 1, status: 'Inactif' },
  ];

  filteredSubscriptions: Subscription[] = [...this.subscriptions];
  searchQuery = '';
  filterDuration = '';
  filterStatus = '';
  showFilter = false;
  showModal = false;
  showViewModal = false;
  showDeleteConfirm = false;
  isEditing = false;
  currentSubscription: Partial<Subscription> = {};
  viewedSubscription: Subscription | null = null;
  subscriptionToDelete: Subscription | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  filterSubscriptions(): void {
    this.filteredSubscriptions = this.subscriptions.filter((subscription) => {
      const matchesSearch =
        subscription.code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        subscription.designation.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesDuration = this.filterDuration ? subscription.duration.toString() === this.filterDuration : true;
      const matchesStatus = this.filterStatus ? subscription.status === this.filterStatus : true;
      return matchesSearch && matchesDuration && matchesStatus;
    });
    this.cdr.detectChanges();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
    this.cdr.detectChanges();
  }

  toggleStatus(subscription: Subscription): void {
    subscription.status = subscription.status === 'Actif' ? 'Inactif' : 'Actif';
    this.filterSubscriptions();
    this.cdr.detectChanges();
  }

  openAddSubscriptionModal(): void {
    this.isEditing = false;
    this.currentSubscription = {
      code: `TYPE-${(this.subscriptions.length + 1).toString().padStart(3, '0')}`,
      designation: '',
      duration: 0,
      price: 0,
      freeAccess: true,
      weeklySessions: 0,
      status: 'Actif',
    };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  openEditSubscriptionModal(subscription: Subscription): void {
    this.isEditing = true;
    this.currentSubscription = { ...subscription };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.currentSubscription = {};
    this.cdr.detectChanges();
  }

  saveSubscription(): void {
    if (this.isEditing) {
      const index = this.subscriptions.findIndex((s) => s.code === (this.currentSubscription as Subscription).code);
      if (index !== -1) {
        this.subscriptions[index] = { ...this.currentSubscription } as Subscription;
      }
    } else {
      this.subscriptions.push({ ...this.currentSubscription } as Subscription);
    }
    this.filteredSubscriptions = [...this.subscriptions];
    this.closeModal();
  }

  viewSubscription(subscription: Subscription): void {
    this.viewedSubscription = subscription;
    this.showViewModal = true;
    this.cdr.detectChanges();
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.viewedSubscription = null;
    this.cdr.detectChanges();
  }

  confirmDeleteSubscription(subscription: Subscription): void {
    this.subscriptionToDelete = subscription;
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.subscriptionToDelete = null;
    this.cdr.detectChanges();
  }

  deleteSubscription(): void {
    if (this.subscriptionToDelete) {
      this.subscriptions = this.subscriptions.filter((s) => s.code !== this.subscriptionToDelete!.code);
      this.filteredSubscriptions = [...this.subscriptions];
      this.cancelDelete();
    }
  }
}