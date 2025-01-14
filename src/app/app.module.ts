import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './features/payments/components/list/list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ViewPaymentComponent } from './features/payments/components/view-payment/view-payment.component';
import { AddPaymentComponent } from './features/payments/components/add-payment/add-payment.component';
import { EditPaymentComponent } from './features/payments/components/edit-payment/edit-payment.component';
import { DeleteConfirmationDialogComponent } from './features/payments/components/delete-confirmation-dialog';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    ViewPaymentComponent,
    AddPaymentComponent,
    DeleteConfirmationDialogComponent,
    EditPaymentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDividerModule,
    MatDatepickerModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatAutocompleteModule,  
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
