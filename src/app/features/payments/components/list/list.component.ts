import { Component, OnInit } from '@angular/core';
import { Payment } from '../../models/payment.model';
import { Router } from "@angular/router";
import { PaymentService } from '../../services/payment.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog';

@Component({
  selector: 'app-payment-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  payments: Payment[] = []; // Full list of payments
  filteredPayments: Payment[] = []; // Filtered list to be displayed
  searchQuery: string = ''; // Store search query
  statusFilter: string = ''; // Filter for payment status
  currentPage: number = 1;
  pageSize: number = 10; // Number of records per page
  totalRecords: number = 1; // Number of records per page
  hasNextPage: boolean = false;
  error: string = '';

  displayedColumns: string[] = ['payee_name', 'due_amount', 'total_due', 'payment_status', 'actions'];

  // constructor(private router: Router) {}
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.fetchPayments();
  }

  getFilters(): any {
    const filters: any = {};

    if (this.searchQuery) {
      filters.search_payee_name = this.searchQuery;
    }

    if (this.statusFilter) {
      filters.payee_payment_status = this.statusFilter;
    }

    return filters;
  }

  // Fetch payments from server (replace with API call)
  fetchPayments(): void {
    const filters = this.getFilters();
    this.paymentService.getPayments(this.currentPage, this.pageSize, filters)
      .subscribe(
          (payments) => {
            this.payments = payments?.items;
            this.totalRecords = payments?.total;
            this.applyFilters();
          }
      );
  }

  // Apply filters based on search query and payment status
  applyFilters(): void {
    this.filteredPayments = this.payments;
  }

  // Search handler
  onSearch(): void {
    this.currentPage = 1; // Reset to first page when searching

    this.fetchPayments();
    this.applyFilters();
  }

  // Filter handler
  onFilter(): void {
    this.currentPage = 1;
    
    this.fetchPayments();
    this.applyFilters();
  }
  

  // Reset filters
  onResetFilters(): void {
    this.searchQuery = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  // Pagination handlers
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.fetchPayments();
    this.applyFilters();
  }

  // Get CSS class for payment status
  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  // Navigate to view payment page
  onView(payment: Payment): void {
    this.router.navigate(['/payment/view', payment._id]);
  }

  onEdit(payment: Payment): void {
    this.router.navigate(['/payment/edit', payment._id]);
  }

  onDelete(payment: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
      data: payment
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletePayment(payment);
      }
    });
  }

  private deletePayment(payment: any): void {
    this.paymentService.deletePayment(payment._id)
    .subscribe(
        () => {
          this.fetchPayments();
          this.applyFilters();
        }
    );
  }
 
}