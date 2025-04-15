import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface Subscription {
  code: string;
  designation: string;
  nbMois: number;
  nbJours: number;
  accesLibre: boolean;
  forfait: number;
  nbSeanceSemaine: number;
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
    { code: 'TYPE-001', designation: 'Mensuel Standard', nbMois: 1, nbJours: 30, accesLibre: true, forfait: 39.99, nbSeanceSemaine: 3 },
    { code: 'TYPE-002', designation: 'Mensuel Premium', nbMois: 1, nbJours: 30, accesLibre: true, forfait: 59.99, nbSeanceSemaine: -1 },
    { code: 'TYPE-003', designation: 'Trimestriel Standard', nbMois: 3, nbJours: 90, accesLibre: true, forfait: 109.99, nbSeanceSemaine: 3 },
    { code: 'TYPE-004', designation: 'Trimestriel Premium', nbMois: 3, nbJours: 90, accesLibre: true, forfait: 169.99, nbSeanceSemaine: -1 },
    { code: 'TYPE-005', designation: 'Annuel Standard', nbMois: 12, nbJours: 365, accesLibre: true, forfait: 399.99, nbSeanceSemaine: 3 },
    { code: 'TYPE-006', designation: 'Annuel Premium', nbMois: 12, nbJours: 365, accesLibre: true, forfait: 599.99, nbSeanceSemaine: -1 },
    { code: 'TYPE-007', designation: 'Pass Journée', nbMois: 0, nbJours: 1, accesLibre: true, forfait: 15.99, nbSeanceSemaine: 1 },
  ];

  filteredSubscriptions: Subscription[] = [...this.subscriptions];
  searchQuery = '';
  filterDuration = '';
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
      const matchesDuration = this.filterDuration ? subscription.nbMois.toString() === this.filterDuration : true;
      return matchesSearch && matchesDuration;
    });
    this.cdr.detectChanges();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
    this.cdr.detectChanges();
  }

  openAddSubscriptionModal(): void {
    this.isEditing = false;
    this.currentSubscription = {
      code: `TYPE-${(this.subscriptions.length + 1).toString().padStart(3, '0')}`,
      designation: '',
      nbMois: 0,
      nbJours: 0,
      accesLibre: true,
      forfait: 0,
      nbSeanceSemaine: 0,
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