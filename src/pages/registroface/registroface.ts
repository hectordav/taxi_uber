import { Component } from '@angular/core';
import { NavController, NavParams,AlertController,IonicPage,ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Prregistro} from "../../providers/prregistro";
import {Prlogin} from "../../providers/prlogin";
import {PrconexionProvider} from "../../providers/prconexion/prconexion";

@IonicPage()
@Component({
  selector: 'page-registroface',
  templateUrl: 'registroface.html'
})
export class RegistrofacePage {
	 	myForm: FormGroup;
		g_genero:any;
		fecha_nac:any;
		get_login:any;
		result:any;

  constructor(public nav: NavController, public navParams: NavParams, public registro:Prregistro,public fb: FormBuilder,public alertCtrl: AlertController, public login:Prlogin,private toastCtrl: ToastController, public conexion:PrconexionProvider) {
       this.myForm= this.fb.group({
      'fecha_nac': ['', [Validators.required]],
      'cedula': ['', [Validators.required]],
      'direccion': ['', [Validators.required]],
      'telf': ['', [Validators.required]]
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistrofacePage');
  }
  guardar_registro(){
    let datos=this.myForm.value;
    let data_face=this.login.get_my_Global_Face();
    let _token=this.login.getToken();
    let _cedula:string=datos['cedula'];
    let _nombre:string=data_face['name']; /* lo toma del registro */
    let _direccion:string=datos['direccion'];
    let _telf:string=datos['telf'];
    let _email:string=data_face['email']; /*lo toma del registro*/
    let _genero:string=data_face['gender']; /*lo toma del registro gender */
    let _fecha_nac:string=this.fecha_nac;
    let _password:string=data_face['id'];/*lo toma del registro*/ 
    let _token_u:any='5oJn^ixsIp~ltoEnXia^Iv[wIhiy]R0TkH6G';
    let _serial=this.login.get_serial();

    this.conexion.conexion();
    let status=this.login.get_variable_status_conexion();
    /*verifica si hay internet*/
    if(status=='desconectado') {
      let toast = this.toastCtrl.create({
        message: 'Verifique la conexion a internet',
        duration: 3500,
        position: 'bottom'
        });
      toast.present();
    }else{
        this.registro.guardar_usuario_face(_token,_cedula,_nombre,_direccion,_telf,_email,_genero,_fecha_nac,_password,_token_u,_serial).subscribe(
            registro => {
            this.result=registro;
            console.log("REGISTRO EXISTE");
             },
             err => {console.log("NO EXISTE REGISTRO");
             },
           );
         let alert = this.alertCtrl.create({
            title: 'Guardar',
            subTitle: 'Registro Guardado Haga clic en Entrar con Facebook para Continuar',
            buttons: ['OK']
            });
          alert.present(); 
          this.nav.setRoot('LoginPage');
    }
   }
}
