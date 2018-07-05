import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,Platform,ToastController } from 'ionic-angular';
import {PrconexionProvider} from "../../providers/prconexion/prconexion";
import {Prlogin} from "../../providers/prlogin";
import {Prservicio} from "../../providers/prservicio";



@IonicPage()
@Component({
  selector: 'page-modalcomentarios',
  templateUrl: 'modalcomentarios.html',
})
export class ModalcomentariosPage {
	result:any;
  backPressed:any=false;
  loader:any;
  constructor(public nav: NavController, public navParams: NavParams, public prlogin:Prlogin, public prservicio:Prservicio, public viewCtrl:ViewController,public platform:Platform,private toastCtrl: ToastController, public conexion:PrconexionProvider) {
      /*****back button*****/
     platform.registerBackButtonAction(() => {
         if (this.nav.canGoBack()) {
          this.nav.pop()
          return;
        }
        if(!this.backPressed) {
          this.backPressed = true
          this.salir();
          setTimeout(() => this.backPressed = false, 2000)
          return;
        }else{
         this.platform.exitApp();
        }
      });
     /*/backbutton*/
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalcomentariosPage');
    this.comentarios();
  }
  comentarios(){
  let data:any=this.prlogin.getMyGlobalVar();
   /*el id usuario del que crea la carrera*/
  let _id_usuario:any=data.json().id_usuario;
  let _token:any='5oJn^ixsIp~ltoEnXia^Iv[wIhiy]R0TkH6G';
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
			 this.prservicio.get_comentarios(_id_usuario,_token).subscribe(
	        prservicio => {
	          this.result=prservicio;
	           console.log("REGISTRO EXISTE");
	        },
	        err => {console.log("NO EXISTE REGISTRO");
	        },
	      );
    }
  }
 	 salir() {
 	 	console.log('sale');
    this.viewCtrl.dismiss();
    }
}
