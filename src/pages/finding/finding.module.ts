import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindingPage } from './finding';

@NgModule({
  declarations: [
    FindingPage,
  ],
  imports: [
    IonicPageModule.forChild(FindingPage)
  ],
  exports: [
    FindingPage
  ]
})
export class FindingPageModule {}