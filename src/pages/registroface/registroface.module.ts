import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistrofacePage } from './registroface';

@NgModule({
  declarations: [
    RegistrofacePage,
  ],
  imports: [
    IonicPageModule.forChild(RegistrofacePage)
  ],
  exports: [
    RegistrofacePage
  ]
})
export class RegistrofacePageModule {}