import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Payment } from '../../models/payment.model';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-view-payment',
  templateUrl: './view-payment.component.html',
  styleUrls: ['./view-payment.component.scss'],
})
export class ViewPaymentComponent implements OnInit {
  paymentId: string | null = null;
  payment: Payment | null = null;
  editMode: boolean = false; // Flag to toggle between view and edit modes
 
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.paymentId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.paymentId) {
      this.fetchPaymentDetails();
    }
  }

  fetchPaymentDetails(): void {
    // Fetch payment details from the service
    if (this.paymentId) {
      this.paymentService.getPaymentById(this.paymentId).subscribe((data) => {
        console.log("Data", data)
        this.payment = data;
      });
    }
  }
  
  // Method to navigate back to the list page
  onBackToList() {
    this.router.navigate(['/payments']);
  }

  // Method to toggle edit mode
  onEdit(): void {
    this.editMode = !this.editMode;
  }

  downloadEvidence(): void {
    if (this.payment?.evidence_file_url) {
      this.paymentService.downloadEvidenceFile(this.payment.evidence_file_url).subscribe(
        (response) => {
          const blob = new Blob([response], { type: response.type });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        },
        (error) => {
          console.error('Error downloading evidence:', error);
        }
      );
    } else {
      console.error('Evidence file URL is undefined');
    }
  }


  onSavePayment(): void {
    if (this.payment && this.paymentId) {
      const paymentIdNumber = this.paymentId; // Convert string to number     
        this.paymentService.updatePayment(paymentIdNumber, this.payment).subscribe(
          (response) => {
            this.router.navigate(['/payments']);
          },
          (error) => {
            console.error('Error updating payment:', error);
          }
        );
     
    }
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}
