import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';  
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.scss']
})

export class EditPaymentComponent implements OnInit {
  @ViewChild('fileInput')
  fileInput!: ElementRef;
  selectedFile: File | null = null;
  maxFileSize = 5 * 1024 * 1024; // 5MB limit
  allowedFileTypes = ['.pdf', '.jpg', '.jpeg', '.png'];

  paymentForm!: FormGroup;
  paymentId: string = '';
  currentPaymentData: any;  // Store the current payment data
  readonly paymentStatuses = ['pending', 'due_now', 'completed', 'overdue'];
  

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,  
    private snackBar: MatSnackBar, 
    private activatedRoute: ActivatedRoute,  // Inject ActivatedRoute to get the URL parameters
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.paymentId = this.activatedRoute.snapshot.paramMap.get('id')!;  // Get the payment ID from the URL
   
    this.paymentForm = this.fb.group({
      payee_first_name: [{ value: '', disabled: true }],
      payee_last_name: [{ value: '', disabled: true }],
      payee_due_date: ['', Validators.required],
      payee_address_line_1: [{ value: '', disabled: true }],
      payee_address_line_2: [{ value: '', disabled: true }],
      payee_city: [{ value: '', disabled: true }],
      payee_country: [{ value: '', disabled: true }],
      payee_province_or_state: [{ value: '', disabled: true }],
      payee_postal_code: [{ value: '', disabled: true }],
      payee_phone_number: [{ value: '', disabled: true }],
      payee_email: [{ value: '', disabled: true }],
      currency: [{ value: '', disabled: true }],
      discount_percent: [{ value: '', disabled: true }],
      tax_percent: [{ value: '', disabled: true }],
      due_amount: ['', [Validators.required, Validators.min(0)]],
      payee_payment_status: ['pending', Validators.required],
      evidence_file_url: [''],
      evidence_file_name: ['']
    });

    // Fetch the current payment data from the API
    this.paymentService.getPaymentById(this.paymentId).subscribe(
      (data) => {
        
        this.currentPaymentData = data;
        this.paymentForm.patchValue({
          payee_first_name: data.payee_first_name,
          payee_last_name: data.payee_last_name,
          payee_due_date: data.payee_due_date,
          payee_address_line_1: data.payee_address_line_1,
          payee_address_line_2: data.payee_address_line_2,
          payee_city: data.payee_city,
          payee_country: data.payee_country,
          payee_province_or_state: data.payee_province_or_state,
          payee_postal_code: data.payee_postal_code,
          payee_phone_number: data.payee_phone_number,
          payee_email: data.payee_email,
          currency: data.currency,
          discount_percent: data.discount_percent,
          tax_percent: data.tax_percent,
          due_amount: data.due_amount,
          payee_payment_status: data.payee_payment_status,
          evidence_file_url: data.evidence_file_url || '',
        });
      },
      (error) => {
        console.error('Error fetching payment data:', error);
        this.snackBar.open('Failed to fetch payment data. Please try again.', 'Close', { duration: 3000 });
      }
    );

    
    this.paymentForm.get('payee_payment_status')?.valueChanges
    .subscribe(status => {
      if (status === 'Completed') {
        this.paymentForm.get('evidence_file_url')?.setValidators([Validators.required]);
      } else {
        this.paymentForm.get('evidence_file_url')?.clearValidators();
      }
      this.paymentForm.get('evidence_file_url')?.updateValueAndValidity();
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Validate file type
    const fileExt = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!this.allowedFileTypes.includes(fileExt)) {
      alert('Invalid file type. Please upload PDF, JPG, or PNG files only.');
      this.fileInput.nativeElement.value = '';
      return;
    }

    // Validate file size
    if (file.size > this.maxFileSize) {
      alert('File size exceeds 5MB limit.');
      this.fileInput.nativeElement.value = '';
      return;
    }

    this.selectedFile = file;
    this.uploadFile();
  }

  async uploadFile() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('paymentId', this.paymentId);
    
  }

  getFileIcon(fileType: string): string {
    if (fileType.includes('pdf')) return 'picture_as_pdf';
    if (fileType.includes('image')) return 'image';
    return 'insert_drive_file';
  }
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget as HTMLElement;
    element.classList.add('drag-over');
  }
  
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget as HTMLElement;
    element.classList.remove('drag-over');
  }
  
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget as HTMLElement;
    element.classList.remove('drag-over');
    
    const files = event.dataTransfer?.files;
    if (files?.length) {
      const file = files[0];
      // this.handleFile(file);
    }
  }
  
  downloadEvidence(event: Event): void {
    event.stopPropagation();
    const evidenceUrl = this.paymentForm.get('evidence_file_url')?.value;
    if (evidenceUrl) {
      window.open(evidenceUrl, '_blank');
    }
  }
  
  removeFile(event: Event): void {
    event.stopPropagation();
    this.selectedFile = null;
    this.paymentForm.patchValue({
      evidence_file_url: '',
      evidence_file_name: ''
    });
    this.fileInput.nativeElement.value = '';
  }

  
  // Form submission handler
  onSubmit(): void {
    
    if (this.paymentForm.valid) {
      let updatedPaymentData = this.paymentForm.value;
      updatedPaymentData = {
        ...updatedPaymentData,
        payee_due_date : this.datePipe.transform(updatedPaymentData.payee_due_date, 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'')
      }
      console.log(updatedPaymentData)
      // Check if the status is 'completed' and evidence is provided
      if (updatedPaymentData.payee_payment_status === 'completed' && !this.selectedFile) {
      
        this.snackBar.open('Please upload evidence before changing the status to completed.', 'Close', { duration: 3000 });
        return;
      }

      

    if (this.selectedFile) {
      this.paymentService.uploadEvidenceFile(this.paymentId, this.selectedFile).subscribe(
        (response) => {
          this.snackBar.open('File uploaded successfully!', 'Close', { duration: 3000 });
          updatedPaymentData.evidence_file_url = response;
          // Call the service to update payment
            this.paymentService.updatePayment(this.paymentId, updatedPaymentData).subscribe(
              (response) => {
                this.snackBar.open('Payment updated successfully!', 'Close', { duration: 3000 });
                this.router.navigate(['/payments']); // Navigate to payments list or dashboard after successful update
              },
              (error) => {
                this.snackBar.open('Failed to update payment. Please try again.', 'Close', { duration: 3000 });
              }
            );
        },
        (error) => {
          this.snackBar.open('Error uploading file: ', 'Close', { duration: 4000 });
        }
      );
    } else {
      
        // Call the service to update payment
        this.paymentService.updatePayment(this.paymentId, updatedPaymentData).subscribe(
          (response) => {
            this.snackBar.open('Payment updated successfully!', 'Close', { duration: 3000 });
            this.router.navigate(['/payments']); // Navigate to payments list or dashboard after successful update
          },
          (error) => {
            this.snackBar.open('Failed to update payment. Please try again.', 'Close', { duration: 3000 });
          }
        );
    }
    
      
    } else {
      this.snackBar.open('Please fix the errors in the form before submitting.', 'Close', { duration: 3000 });
    }
  }

  
}
