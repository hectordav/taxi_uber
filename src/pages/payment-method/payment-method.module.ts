import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentMethodPage } from './payment-method';

@NgModule({
  declarations: [
    PaymentMethodPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentMethodPage)
  ],
  exports: [
    PaymentMethodPage
  ]
})
export class PaymentMethodPageModule {}