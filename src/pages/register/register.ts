import { Component } from '@angular/core';
import {IonicPage, NavController,AlertController ,Platform} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Prregistro} from "../../providers/prregistro";
import {Prlogin} from "../../providers/prlogin";


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  myForm: FormGroup;
  g_genero:any;
  fecha_nac:any;
  get_login:any;
  result:any;
  backPressed:any;;
  constructor(public nav:NavController,public fb: FormBuilder,public alertCtrl: AlertController, public login2:Prlogin, public registro:Prregistro,  public platform: Platform) {
    this.myForm= this.fb.group({
      'fecha_nac': ['', [Validators.required]],
      'nombre': ['', [Validators.required]],
      'telf': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)]],
      'password': ['', [Validators.required]]
    })
    platform.registerBackButtonAction(() => {
         if (this.nav.canGoBack()) {
          this.nav.pop()
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
    this.nav.setRoot('LoginPage');
  }
   guardar_registro(){
    let datos=this.myForm.value;
    let _token:any=this.login2.getToken();
    let _cedula:string='1234';
    let _nombre:string=datos['nombre'];
    let _direccion:string='Sin Direccion';
    let _telf:string=datos['telf'];
    let _email:string=datos['email'];
    let _genero:string=this.g_genero;
    let _fecha_nac:string=this.fecha_nac;
    let _password:string=datos['password'];
    let _token_u:any='5oJn^ixsIp~ltoEnXia^Iv[wIhiy]R0TkH6G';
    let _serial=this.login2.get_serial();
         this.registro.get_usuario_login(_email,_token_u).subscribe(
            registro => {
              this.get_login=registro;
              console.log(registro);
              if(registro.json().id=="existe usuario") {
               let alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: 'Usuario ya existe',
                  buttons: ['OK']
                  });
                  alert.present();        
              }else{
        this.registro.guardar_usuario(_token,_cedula,_nombre,_direccion,_telf,_email,_genero,_fecha_nac,_password,_token_u,_serial).subscribe(
            registro => {
            this.result=registro;
            console.log("REGISTRO EXISTE");
             },
             err => {console.log("NO EXISTE REGISTRO");
             },
         );
         let alert = this.alertCtrl.create({
                title: 'Guardar',
                subTitle: 'Registro Guardado, ya puede iniciar Sesion',
                buttons: ['OK']
                });
              alert.present(); 
               this.nav.setRoot('LoginPage');  
          }
            },
            err => {console.log("NO EXISTE REGISTRO");
            },
        );  
  }

}
