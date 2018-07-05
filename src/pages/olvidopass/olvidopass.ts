import { Component } from '@angular/core';
import { NavController, NavParams,AlertController,IonicPage,Platform,ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PrconexionProvider} from "../../providers/prconexion/prconexion";
import {Prregistro} from "../../providers/prregistro";
import {Prlogin} from "../../providers/prlogin";

@IonicPage()
@Component({
  selector: 'page-olvidopass',
  templateUrl: 'olvidopass.html'
})
export class OlvidopassPage {
		 myForm: FormGroup;
		 result:any;
     backPressed:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public fb: FormBuilder,public registro:Prregistro,public alertCtrl: AlertController, public platform: Platform,private toastCtrl: ToastController, public conexion:PrconexionProvider, public prlogin:Prlogin) {
			this.myForm= this.fb.group({
			'email': ['', [Validators.required, Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)]]
			})
        platform.registerBackButtonAction(() => {
         if (this.navCtrl.canGoBack()) {
          this.navCtrl.pop()
          return;
        }
        if(!this.backPressed) {
          this.backPressed = true
          this.volver_login();
          setTimeout(() => this.backPressed = false, 2000)
          return;
        }else{
        }
      });
  }
    volver_login(){
    this.navCtrl.setRoot('LoginPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OlvidopassPage');
  }
    buscar_email(){
  	let datos=this.myForm.value;
  	let _email:string=datos['email'];
    let _token:any='5oJn^ixsIp~ltoEnXia^Iv[wIhiy]R0TkH6G';
    console.log(_email);
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
		 this.registro.get_usuario_login(_email,_token).subscribe(
        registro => {
          this.result=registro;
           console.log("REGISTRO EXISTE");
         if(registro.json().id=="existe usuario") {
         	let alert = this.alertCtrl.create({
              title: 'Registro',
              subTitle: 'Se acaba de enviar un email para el reestablecimiento de su password; Revise su Bandeja de entrada.',
              buttons: ['OK']
              });
					this.navCtrl.setRoot('LoginPage');
					alert.present();              
          }else{
          	let alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: 'Usuario no existe',
              buttons: ['OK']
              });
              alert.present();  
          }
        },
        err => {console.log("NO EXISTE REGISTRO");
        },
    );
   }
 }

}
