import {Component} from '@angular/core';
import {IonicPage,NavController,AlertController,LoadingController,Platform, ToastController } from 'ionic-angular';
/*import {RegisterPage} from '../register/register';
import {HomePage} from '../home/home';*/
import {Prlogin} from "../../providers/prlogin";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Facebook} from 'ionic-native';
import {PrconexionProvider} from "../../providers/prconexion/prconexion";
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  myForm: FormGroup;
  results: any;
  loader: any;
  backPressed:any;
  result_login_token:any;
  serial_device:any='undefined';
  status:any;

  constructor(public nav: NavController, public fb: FormBuilder, public alertCtrl: AlertController, public prlogin:Prlogin, public loadingCtrl:LoadingController, public platform:Platform, private toastCtrl: ToastController, public conexion:PrconexionProvider) {
    this.myForm= this.fb.group({
      'email': ['', [Validators.required, Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)]],
      'password': ['', [Validators.required]],
    })
    platform.registerBackButtonAction(() => {
         if (this.nav.canGoBack()) {
          this.nav.pop()
          return;
        }
        if(!this.backPressed) {
          this.backPressed = true
          this.salir_sistema();
          setTimeout(() => this.backPressed = false, 2000)
          return;
        }else{
        }
      });
  
  }

  signup() {
    this.nav.setRoot('RegisterPage');
  }
    salir_sistema() {
       this.loader= this.alertCtrl.create({
             title: 'Confirmar',
          message: 'Realmente desea Salir',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Salir',
              handler: () => {
                  this.platform.exitApp();
              }
            }
          ]
         });
      this.loader.present();  
    }
  login(){
    let datos: any[];
    datos=this.myForm.value;
    let user: string=datos['email'];
    let pass: string=datos['password'];
    let _token_u:any='5oJn^ixsIp~ltoEnXia^Iv[wIhiy]R0TkH6G';
    let token:string=this.prlogin.getToken();
    let _serial=this.prlogin.get_serial();
    this.conexion.conexion();
    this.status=this.prlogin.get_variable_status_conexion();
    /*verifica si hay internet*/
    if(this.status=='desconectado') {
      let toast = this.toastCtrl.create({
        message: 'Verifique la conexion a internet',
        duration: 3500,
        position: 'bottom'
        });
      toast.present();
    }else{
      this.presentLoading();
      /******************se loguea*************************/
       this.prlogin.login(user,pass,_token_u,_serial).subscribe(
          prlogin => {
            this.results=prlogin;
             console.log(prlogin);
           if(this.results['_body']=="null") {
            let alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: 'Usuario y contraseña no validos',
              buttons: ['OK']
              });
              alert.present();       
          }else{
           if(prlogin.json().id_estado_usuario==2) {
              let alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: 'Usuario Inactivo',
              buttons: ['OK']
              });
              alert.present();
           }else{
             if(prlogin.json().id_nivel==1 || prlogin.json().id_nivel==2){
             let alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: 'Debes ser un cliente para iniciar sesion',
              buttons: ['OK']
              });
              alert.present();
             }else{
               this.prlogin.setMyGlobalVar(this.results);
               /*busca si el token es el mismo por si cambia de dispositivo*/
                   this.prlogin.buscar_usuario_manual_token(user,pass,token,_token_u).subscribe(
                      prlogin => {
                        this.results=prlogin;
                         console.log("REGISTRO EXISTE");
                          this.loader.dismiss();
                            /*envia a la pagina principal*/
                           this.nav.setRoot('HomePage');
                           /******************************/
                      },
                      err => {alert(err);
                      },
                  );
             
             }
           }
          /*  this.loader.dismiss();*/
          }
        },
          err => {console.log("NO EXISTE REGISTRO");
          },
      );
       /*****************************/
    }
    /******************************/    
  }

  /****************/
   /*aqui se loguea con el facebook abre la sesion y luego lo envia al getdetails*/
  login_facebook(){ 

    this.conexion.conexion();
    this.status=this.prlogin.get_variable_status_conexion();
    /*verifica si hay internet*/
    if(this.status=='desconectado') {
      let toast = this.toastCtrl.create({
        message: 'Verifique la conexion a internet',
        duration: 3500,
        position: 'bottom'
        });
      toast.present();
    }else{
       this.getdetails();  
    }
  }

   /*verifica si el usuario ya se logueo y si ya se logueó entra directo al home, sino existe entra en el registro y luego guarda los datos*/
   getdetails(){
     let token:string=this.prlogin.getToken();
     let _token_u:any='5oJn^ixsIp~ltoEnXia^Iv[wIhiy]R0TkH6G';
    Facebook.getLoginStatus().then((response)=>{
      if(response.status=='connected') {
        Facebook.api('/' + response.authResponse.userID + '?fields=id,name, email,gender',[]).then((response)=>{
          let data:any=response;
          let login=data['email'];
          let clave=data['id'];
          let id_estado_usuario;
          let id_nivel;
          this.presentLoading();
           this.prlogin.login_facebook(login,clave,_token_u).subscribe(
                  prlogin => {
                    this.results=prlogin;
                   /* el registro por facebook*/
          if(this.results['_body']=="null") { 
            /*como no existe, lo envia al registro de facebook*/
             this.prlogin.set_my_Global_Face(data);
             console.log('entra en registro face');
             this.nav.setRoot('RegistrofacePage');
          }else{
          
           if(prlogin.json().id_estado_usuario==2) {
              alert('Usuario Inactivo');
           }else{
          
             if(prlogin.json().id_nivel==1 || prlogin.json().id_nivel==2){
               alert('Debes ser un cliente para iniciar sesion');
             }else{
               this.prlogin.setMyGlobalVar(this.results);
               /*busca si el token es el mismo por si cambia de dispositivo*/
                   this.prlogin.buscar_usuario_face_token(login,clave,token).subscribe(
                      prlogin => {
                       this.results=prlogin;
                       console.log("REGISTRO EXISTE");
                      },
                      err => {alert(err);                      
                      },
                  );
                  this.loader.dismiss();
              /*envia a la pagina principal*/
             this.nav.setRoot('HomePage');
             /*¨****************************/
             }
           }
          }   
            }
           );
        },(error)=>{
      console.log('el error ultimo'+error);
    })
      }else{
        /*si no esta conectado a la pagina, envia la pantalla para hacerlo*/
         Facebook.login(['email']).then((response)=>{
            this.getdetails();
          },(error)=>{
            console.log(error);
          })
      }
    })
  }
  presentLoading() {
      this.loader = this.loadingCtrl.create({
          content: "Cargando..."
      });
      this.loader.present();
      }
olvido_password(){
   this.nav.setRoot('OlvidopassPage');
}

}
