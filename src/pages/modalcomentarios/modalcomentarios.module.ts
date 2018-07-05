import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalcomentariosPage } from './modalcomentarios';

@NgModule({
  declarations: [
    ModalcomentariosPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalcomentariosPage),
  ],
  exports: [
    ModalcomentariosPage
  ]
})
export class ModalcomentariosPageModule {}
