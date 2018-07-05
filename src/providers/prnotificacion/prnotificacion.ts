import { Injectable } from '@angular/core';
import {AlertController} from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Push} from '@ionic/cloud-angular'; //asi mismo como está


@Injectable()
export class PrnotificacionProvider {

  constructor(public http: Http,public push:Push,public alertCtrl: AlertController) {
    console.log('Hello PrnotificacionProvider Provider');
  }
   notification(){
    this.push.rx.notification()
  .subscribe((msg) => {
  	  let alert = this.alertCtrl.create({
                 title: 'Mensaje',
                 subTitle: msg.title + ': ' + msg.text,
                 buttons: ['OK']
                 });
                 alert.present();
  });
  }

}
