import { Component } from '@angular/core';
import { IonicPage,NavController,Platform,AlertController,ToastController } from 'ionic-angular';
import { DriverService } from '../../services/driver-service';
import {Prconductores} from "../../providers/prconductores";
import {Prlogin} from "../../providers/prlogin";
import {Prservicio} from "../../providers/prservicio";
import {PrconexionProvider} from "../../providers/prconexion/prconexion";

@IonicPage()
@Component({
  selector: 'page-finding',
  templateUrl: 'finding.html'
})
export class FindingPage {
  public drivers:any;
  public result:any;
  intervalo:any;
  backPressed:any=false;
  loader:any;
  sumar_intentos:number=0;
  result_eliminar:any;
  id_servicio:any;
  result_servicio:any;
  constructor(public nav: NavController, public driverService:DriverService, public conductores:Prconductores,public prlogin:Prlogin,public prservicio:Prservicio,public platform: Platform,public alertCtrl: AlertController,private toastCtrl: ToastController, public conexion:PrconexionProvider) {
    this.inicia_intervalo_busca_solicitud();
 /*   this.conductores_disponibles();*/
     /*****back button*****/
     platform.registerBackButtonAction(() => {
       
         if (this.nav.canGoBack()) {
          this.nav.pop()
          return;
        }
        if(!this.backPressed) {
          this.backPressed = true
          this.cancelar_solicitud_taxi();
          setTimeout(() => this.backPressed = false, 2000)
          return;
        }else{
     
        }
      });
     /*/backbutton*/
  }
  inicia_intervalo_busca_solicitud(){
      this.intervalo=setInterval(() => {
      this.buscar_solicitud_aceptada()}, 5000);
  }
     cancelar_solicitud_taxi(){
      this.loader= this.alertCtrl.create({
             title: 'Confirmar',
          message: 'Esta accion cancelará la solicitud de carrera en curso, desea continuar?',
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
                  this.nav.push('CancelarsolicitudPage');
              }
            }
          ]
         });
      this.loader.present();
  }

  cancelar_solicitud(){
    console.log('cancelarsolicitud');
    this.nav.push('CancelarsolicitudPage');
    clearInterval(this.intervalo);
  }
   buscar_solicitud_aceptada(){
     let data:any=this.prlogin.getMyGlobalVar();
     let _token:any='5oJn^ixsIp~ltoEnXia^Iv[wIhiy]R0TkH6G';
     let id_usuario:any=data.json().id_usuario;
     /*para el intervalo de inicia_intervalo_busca_solicitud*/
     clearInterval(this.intervalo);
    /*busca la solicitud si el taxista la acepta*/ 
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
       this.prservicio.get_solicitud_aceptada(id_usuario,_token).subscribe(
        prservicio => {
          this.result=prservicio;
          console.log(this.result);
          console.log('entra en solicitud aceptada');
          if(this.result===null) {
            console.log('no lo consigue');
            this.sumar_intentos=this.sumar_intentos+1;
            console.log(this.sumar_intentos);
            this.sacar_solicitud();

          }else{
             for(let value of this.result) {
              this.id_servicio=value.id;              
             }
            let _token:any='5oJn^ixsIp~ltoEnXia^Iv[wIhiy]R0TkH6G';
             this.prservicio.get_datos_taxista_id_cliente_id_servicio(this.id_servicio,_token).subscribe(
                prservicio => {
                  this.result_servicio=prservicio;
                   console.log("REGISTRO EXISTE");
                  this.prservicio.set_datos_servicio_global(this.result_servicio);
                  console.log('acepta la solicitud');
                  clearInterval(this.intervalo);
                  console.log("para el intervalo");
                  this.nav.setRoot('DriverPage');
                },
                err => {console.log("NO EXISTE REGISTRO");
                },
              );
           
          }
        },
        err => {console.log("NO EXISTE REGISTRO");
          },
      );
    }
  
  }
  sacar_solicitud(){
    console.log('entra en sacar solicitud');
    
    if( this.sumar_intentos==24) {
     let id_servicio=this.prservicio.get_id_servicio();
      this.prservicio.eliminar_servicio(id_servicio).subscribe(
         prservicio => {
           this.result_eliminar=prservicio;
                  let alert = this.alertCtrl.create({
              title: 'Informacion',
              subTitle: 'No se encuentran choferes disponibles, Intente en unos minutos',
              buttons: ['OK']
              });
              alert.present();
              this.nav.setRoot('HomePage');
         },
         err => {console.log("NO EXISTE REGISTRO");
         },
       );
    }else{
      /*arranca otra vez el intervalo*/
      this.inicia_intervalo_busca_solicitud();
    }
  }
}

