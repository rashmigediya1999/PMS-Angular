import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './features/payments/components/list/list.component';
import { ViewPaymentComponent } from './features/payments/components/view-payment/view-payment.component';
import { AddPaymentComponent } from './features/payments/components/add-payment/add-payment.component';
import { EditPaymentComponent } from './features/payments/components/edit-payment/edit-payment.component';
// import { MainComponent } from './features/payments/main/main.component';
// import { AddComponent } from './features/payments/add/add.component';
// import { EditComponent } from './features/payments/edit/edit.component';

const routes: Routes = [
  { path: '', redirectTo: '/payments', pathMatch: 'full' }, // Redirect to MainComponent
  { path: 'payments', component: ListComponent },
  { path: 'payment/add', component: AddPaymentComponent },
  { path: 'payment/view/:id', component: ViewPaymentComponent},
  { path: 'payment/edit/:id', component: EditPaymentComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
