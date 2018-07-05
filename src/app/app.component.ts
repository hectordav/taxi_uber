import {Component} from '@angular/core';
import {Platform,App,AlertController,LoadingController} from 'ionic-angular';
import {ViewChild} from '@angular/core';
import {StatusBar} from 'ionic-native';
import { SplashScreen } from '@ionic-native/splash-screen';
// import pages
import {LoginPage} from '../pages/login/login';
import {HomePage} from '../pages/home/home';
/*provider*/
import {Prlogin} from "../providers/prlogin";
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { OneSignal } from '@ionic-native/onesignal';
declare var cordova:any;

@Component({
  templateUrl: 'app.html',
  queries: {
    nav: new ViewChild('content')
  }
})
export class MyApp {

  public rootPage: any;

  public nav: any;

  public pages = [
    {
      title: 'Home',
      icon: 'ios-home-outline',
      count: 0,
      component: HomePage
    },
    
    {
      title: 'Logout',
      icon: 'ios-log-out-outline',
      count: 0,
      component: LoginPage
    }
  ];
  /*variables*/
  backPressed:any=false;
  loader:any;
  result_login_token:any;
  serial_device:any;
  /***********/
  constructor(public platform: Platform, public oneSignal: OneSignal, public login:Prlogin,public app:App, public alertCtrl:AlertController,public _SplashScreen: SplashScreen, private device: Device,public network:Network, public loadingCtrl:LoadingController) {
    this.rootPage = 'LoginPage';
    platform.ready().then(() => {
      /*el splashscreen*/
      setTimeout(() => {
        this._SplashScreen.hide();
        this.notificaciones();
      }, 100);
      /*****************/
   /****************/
      StatusBar.styleDefault();
      this.conexion();
       /******************en segundo plano********************+*/
        /* esto se debe agregar en la consola raiz del proyecto
        cordova plugin add cordova-plugin-background-mode   */
        console.log("MyApp::constructor platform.ready");
        cordova.plugins.backgroundMode.setDefaults({ 
           title: 'Taxi Cliente', 
           text: 'Esta activa en segundo plano',
           icon:'assets/img/logo.png'
          },
        cordova.plugins.backgroundMode.enable()
          )
   /********************************************************/
     /*****back button*****/
     platform.registerBackButtonAction(() => {
       
         if (this.nav.canGoBack()) {
          this.nav.pop()
          return;
        }
        if(!this.backPressed) {
          this.backPressed = true
          this.presentLoading();
          setTimeout(() => this.backPressed = false, 2000)
          return;
        }else{
         this.platform.exitApp();
        }
      });
     /*/backbutton*/
    });
    
  }
  private notificaciones(){
    this.serial_device=this.device.uuid;
    this.oneSignal.startInit('54b055b5-d28d-4a0a-9f15-147a509b4556', '544915460436');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    this.oneSignal.handleNotificationOpened()
  .subscribe(jsonData => {
    let alert = this.alertCtrl.create({
      title: jsonData.notification.payload.title,
      subTitle: jsonData.notification.payload.body,
      buttons: ['OK']
    });
    alert.present();
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  });
  this.oneSignal.endInit();
    this.presentLoading_carga();
    this.oneSignal.getIds().then((id)=>{
    let el_id=id.userId; /*el id para guardarlo en el token de la base de datos*/
    this.login.setToken(el_id);
    this.serial_device=this.device.uuid; /* el serial del dispositivo*/
    this.login.set_serial(this.serial_device);
    this.loader.dismiss();
  })
  }
  presentLoading_carga() {
      this.loader = this.loadingCtrl.create({
          content: "Cargando..."
      });
      this.loader.present();
   }
  conexion(){
    let status;
    this.network.onDisconnect().subscribe(() => {
      
      status='desconectado';
      this.login.set_variable_status_conexion(status);
    });
    // watch network for a connection
    this.network.onConnect().subscribe(() => {
      
      status='conectado';
      this.login.set_variable_status_conexion(status);
    });
  }

  presentLoading() {
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
    /*el token para el push*/
   /* private registerToken(){
    this.push.register().then((t: PushToken) => {
      return this.push.saveToken(t,{
        ignore_user: true
      });
    }).then((t: PushToken) => {
       this.login.setToken(t.token);
       this.serial_device=this.device.uuid;
       this.login.set_serial(this.serial_device);
    });
  }*/
  /*****************************/
 
  /************************************/
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}


