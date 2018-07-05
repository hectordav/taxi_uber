import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OlvidopassPage } from './olvidopass';

@NgModule({
  declarations: [
    OlvidopassPage,
  ],
  imports: [
    IonicPageModule.forChild(OlvidopassPage)
  ],
  exports: [
    OlvidopassPage
  ]
})
export class OlvidopassPageModule {}