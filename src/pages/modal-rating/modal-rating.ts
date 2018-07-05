import { Component } from '@angular/core';
import { NavController,IonicPage,AlertController,Platform,ToastController } from 'ionic-angular';
import {Prlogin} from "../../providers/prlogin";
import {Prservicio} from "../../providers/prservicio";
import {PrconexionProvider} from "../../providers/prconexion/prconexion";


@IonicPage()
@Component({
  selector: 'page-modal-rating',
  templateUrl: 'modal-rating.html'
})
export class ModalRatingPage {
	rate:any=0;
	comentario:any;
	result:any;
  backPressed:any=false;
  loader:any;
  constructor(public nav: NavController,public prlogin:Prlogin, public prservicio:Prservicio,public alertCtrl: AlertController,public platform:Platform,private toastCtrl: ToastController, public conexion:PrconexionProvider) {
      /*****back button*****/
     platform.registerBackButtonAction(() => {
         if (this.nav.canGoBack()) {
          this.nav.pop()
          return;
        }
        if(!this.backPressed) {
          this.backPressed = true
          this.Salir_home();
          setTimeout(() => this.backPressed = false, 2000)
          return;
        }else{
         this.Salir_home();
        }
      });
     /*/backbutton*/
  }
    guardar_valores(){
  	let _rating=this.rate;
  	let _comentario=this.comentario;
  	let _id_taxista:any=this.prservicio.get_id_taxista();
    this.conexion.conexion();
    let status=this.prlogin.get_variable_status_conexion();
    /*verifica si hay internet*/
    if(status=='desconectado') {
      let toast = this.toastCtrl.create({
        message: 'Verifique la conexion a internet',
        duration: 3500,
        position: 'bottom'
        });
      toast.present();
    }else{
		 this.prservicio.calificar_usuario(_rating,_comentario,_id_taxista).subscribe(
        prservicio => {
          this.result=prservicio;
           console.log("REGISTRO EXISTE");
        },
        err => {console.log("NO EXISTE REGISTRO");
        },
    );
		 let alert = this.alertCtrl.create({
        title: 'Gracias',
        subTitle:'Con tu ayuda podemos mejorar nuestro servicio',
        buttons: ['OK']
        });
        alert.present();
        this.nav.setRoot('HomePage');
    }

  	}
      Salir_home(){
      this.loader= this.alertCtrl.create({
             title: 'Confirmar',
          message: 'Tu opnion es muy importante para nosotros, esta accion descarta dejar un comentario sobre el servicio prestado; realmente desea salir al menu principal?',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Si',
              handler: () => {
                this.nav.setRoot('HomePage');
              }
            }
          ]
         });
      this.loader.present();
  }
}

