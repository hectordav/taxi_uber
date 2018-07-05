import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage,AlertController,LoadingController,ToastController } from 'ionic-angular';
import {Prlogin} from "../../providers/prlogin";
import {PrconexionProvider} from "../../providers/prconexion/prconexion";

@IonicPage()
@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
})
export class InicioPage {
	splash = true;
	tabBarElement: any;
	serial_device:any='0';
	results:any;
	loader:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public prlogin:Prlogin,public alertCtrl: AlertController,public loadingCtrl:LoadingController,private toastCtrl: ToastController, public conexion:PrconexionProvider ) {
  	   this.tabBarElement = document.querySelector('.tabbar');
	    setTimeout(()=>{ this.serial();},3000);
  }

  ionViewDidLoad() {
     this.tabBarElement.style.display = 'none';
	    setTimeout(() => {
	      this.splash = false;
	      this.tabBarElement.style.display = 'flex';
	    }, 4000);
  }
    serial(){
       let id=setInterval(()=>{
       let token=null;  
       token=this.prlogin.getToken();
       this.serial_device=this.prlogin.get_serial();
       this.conexion.conexion();
         if(this.serial_device!=undefined && token!=null) {
           clearInterval(id);
           this.login_serial();
         }else{
         }
   },1000);
  }
    login_serial() {
	    let _serial= this.prlogin.get_serial();
	    let _token_u:any='5oJn^ixsIp~ltoEnXia^Iv[wIhiy]R0TkH6G';
	    let token:string=this.prlogin.getToken();
      /*se loguea*/
      if(status=='desconectado') {
        let toast = this.toastCtrl.create({
          message: 'Verifique la conexion a internet',
          duration: 3500,
          position: 'bottom'
          });
        toast.present();
      }else{
       this.prlogin.login_serial(_serial,token).subscribe(
          prlogin => {
            this.results=prlogin;
             console.log(prlogin);
           if(this.results['_body']=="null") {
            let alert_2 = this.alertCtrl.create({
              title: 'Error',
              subTitle: 'Equipo no registrado',
              buttons: ['OK']
              });
              alert_2.present();
           
              this.navCtrl.setRoot('LoginPage');
          }else{
           if(prlogin.json().id_estado_usuario==2) {
              let alert_2 = this.alertCtrl.create({
              title: 'Error',
              subTitle: 'Usuario Inactivo',
              buttons: ['OK']
              });
              alert_2.present();
              this.navCtrl.setRoot('LoginPage');
           }else{
             if(prlogin.json().id_nivel==1 || prlogin.json().id_nivel==2 || prlogin.json().id_nivel==3){
             let alert_2 = this.alertCtrl.create({
              title: 'Error',
              subTitle: 'Debes ser un cliente para iniciar sesion',
              buttons: ['OK']
              });
              alert_2.present();
              this.navCtrl.setRoot('LoginPage');
             }else{
								this.presentLoading();
               this.prlogin.setMyGlobalVar(this.results);
               /*busca si el token es el mismo por si cambia de dispositivo*/
                   this.prlogin.buscar_usuario_manual_serial(_serial,token,_token_u).subscribe(
                      prlogin => {
                        this.results=prlogin;
                         console.log("REGISTRO EXISTE");
                      },
                      err => {console.log(err);
                      },
                  );
            		 this.navCtrl.setRoot('HomePage');
								this.loader.dismiss();
              /*envia a la pagina principal*/
             /******************************/
             }
           }
          /*  this.loader.dismiss();*/
          }
        },
          err => {console.log("NO EXISTE REGISTRO");
          },
      );
     }
       /***********/
  }
  presentLoading() {
    this.loader = this.loadingCtrl.create({
        content: "Cargando..."
    });
    this.loader.present();
      }


}
