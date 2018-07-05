import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CancelarsolicitudPage } from './cancelarsolicitud';

@NgModule({
  declarations: [
    CancelarsolicitudPage,
  ],
  imports: [
    IonicPageModule.forChild(CancelarsolicitudPage)
  ],
  exports: [
    CancelarsolicitudPage
  ]
})
export class CancelarsolicitudPageModule {}