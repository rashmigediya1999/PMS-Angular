import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root', // Makes the service available globally
})
export class PaymentService {

  private apiUrl = 'https://pms-backend-ae27b8115c4a.herokuapp.com/api/v1'; // Replace with your API URL
  
  constructor(private http: HttpClient) { }

  // Get payments with pagination
  getPayments(page: number = 1, pageSize: number = 10, filters: any = {}): Observable<any> {
    
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

      for (const key in filters) {
        if (filters.hasOwnProperty(key)) {
          params = params.set(key, filters[key]);
        }
      }
    // Append filters to the query parameters
    const url = `${this.apiUrl}/payments`;
    return this.http.get<any>(url, { params });
  }

  // Fetch a single payment by ID
  getPaymentById(paymentId: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/payment/${paymentId}`);
  }

  // Update payment
  updatePayment(paymentId: string | number, payment: Payment): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/payment/${paymentId}`, payment);
  }
  

  // Create a new payment
  addPayment(payment: Payment): Observable<Payment> {
    console.log('Payment:', payment);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  
    return this.http.post<Payment>(`${this.apiUrl}/payment`, payment, { headers });
  }

  // Delete a payment
  deletePayment(paymentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/payment/${paymentId}`);
  }

  uploadEvidenceFile(paymentId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/payment/${paymentId}/upload_evidence`, formData);
  }
  downloadEvidenceFile(fileId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/payment/download_evidence/${fileId}`, {
      responseType: 'blob',
    });
  }
}
