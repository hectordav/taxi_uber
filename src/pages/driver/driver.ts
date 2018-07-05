import { Component } from '@angular/core';
import { NavController,AlertController,IonicPage,ModalController,Platform,ToastController} from 'ionic-angular';
import { DriverService } from '../../services/driver-service';
import {Prlogin} from "../../providers/prlogin";
import {Prservicio} from "../../providers/prservicio";
import {PrconexionProvider} from "../../providers/prconexion/prconexion";

@IonicPage()
@Component({
  selector: 'page-driver',
  templateUrl: 'driver.html'
})
export class DriverPage {
   public driver:any;
   result:any={
     id_servicio:'',
     id_usuario_conductor:'',
     adjunto:'',
     nombre:'',
     placa:'',
     descripcion_tipo:'',
     descripcion_marca:'',
     descripcion_modelo:''
   };
   result2:any;
   result3:any;
   g_select:number;
   codigo_promo:string;
   monto:any;
   id_usuario:any;
   id_usuario_conductor:any;
   id_servicio:any;
   result_puntaje:any;
   puntaje_obtenido:any=0;
   backPressed:any=false;
   loader:any;
   intervalo_estado_servicio:any;
   result_2:any;
   lat_lng_i:any;
   lat_lng_f:any;
   result_monto:any;
   variable_content:any='Felicidades ha encontrado un conductor';
   buttonDisabled:boolean=null;
   observaciones_conductor:any;


  constructor(public nav: NavController, public driverService:DriverService, public prlogin:Prlogin, public prservicio:Prservicio, public alertCtrl: AlertController,public modalCtrl: ModalController,public platform: Platform,private toastCtrl: ToastController, public conexion:PrconexionProvider) {
    this.estado_servicio_contador();
    // get driver info
    this.driver = driverService.getItem(1);
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

   ionViewDidLoad() {
    this.datos_conductor();
    this.get_puntaje_driver();
  }
  estado_servicio_contador(){
     this.intervalo_estado_servicio=setInterval(() => {
      this.estado_servicio();
    }, 10000);
  }
 
  datos_conductor(){
   let data_2:any=this.prservicio.get_datos_servicio_global();
   /*asi se saca el valor '0.0'*/
   for(let value of data_2) {
     this.id_servicio=value.id_servicio;
      this.result.id_servicio=value.id_servicio;
      this.result.id_usuario_conductor=value.id_usuario_conductor;
      this.result.adjunto=value.adjunto;
      this.result.nombre=value.nombre;
      this.result.placa=value.placa;
      this.result.descripcion_tipo=value.descripcion_tipo;
      this.result.descripcion_marca=value.descripcion_marca;
      this.result.descripcion_modelo=value.descripcion_modelo;
   }
   
   this.prservicio.set_id_servicio(this.id_servicio);
   let alert = this.alertCtrl.create({
       title: 'Informacion',
       subTitle: 'Su Carrera Fue aceptada',
       buttons: ['OK']
       });
       alert.present();
   
  }
    trackin_page(){
     let _id_usuario_conductor:any=this.result.id_usuario_conductor;
     let _id_servicio:any=this.result.id_servicio;
     this.id_usuario_conductor=_id_usuario_conductor;
     this.prservicio.set_id_taxista(_id_usuario_conductor);
     this.prservicio.set_id_servicio(_id_servicio);
     /*aqui va el envio de email*/
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
      this.prservicio.set_variable_cambio_tracking(0);
      this.nav.setRoot('TrackingPage');
    }
  }
   cancelar_solicitud_taxi(){
      this.loader= this.alertCtrl.create({
             title: 'Confirmar',
          message: 'Esta accion cancelará el la carrera en curso, desea continuar?',
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
                console.log('para el intervalo de buscar status de la carrera');
                clearInterval(this.intervalo_estado_servicio);
                this.prservicio.set_variable_cancela_driver(1);
                  this.nav.push('CancelarsolicitudPage');
              }
            }
          ]
         });
      this.loader.present();
  }
  get_puntaje_driver(){
  let data:any=this.prlogin.getMyGlobalVar();
   /*el id usuario del que crea la carrera*/
  let _id_usuario:any=data.json().id_usuario;
  let _token:any='5oJn^ixsIp~ltoEnXia^Iv[wIhiy]R0TkH6G';
  console.log('el id usuario');
  console.log(_id_usuario);
       this.prservicio.get_puntaje_driver(_id_usuario,_token).subscribe(
          prservicio => {
            this.result_puntaje=prservicio;
            console.log('el puntaje');
            console.log(this.result_puntaje);
             
            if(this.result_puntaje==null){
              console.log('entro en el if');
            let puntaje='0.0';
            this.get_puntaje_driver_2(puntaje);
            this.puntaje_obtenido=0; 
            console.log(this.puntaje_obtenido);
            }else{
            let valor_puntaje;
             for(let value of prservicio) {
              valor_puntaje=value.puntaje;
             }
            this.result_puntaje=valor_puntaje;
              console.log('en el else');
             this.get_puntaje_driver_2(this.result_puntaje);
             console.log("REGISTRO EXISTE");
            }
          },
          err => {console.log("NO EXISTE REGISTRO");
          },
      );
}   
// make array with range is n
 range(n) {
    return new Array(n);
  }
/*esto viene del get_puntaje_driver*/
/*esto viene del get_puntaje_driver*/
  get_puntaje_driver_2(valor){
    console.log(valor);
    
    for (let valorpuntaje of valor) {
     let valor_1= valorpuntaje.split('.');
     console.log('el valor puntaje');
     if(valor_1[0]=='1') {
      this.puntaje_obtenido=1;
     }
     if(valor_1[0]=='2') {
      this.puntaje_obtenido=2;
     }
     if(valor_1[0]=='3') {
      this.puntaje_obtenido=3;
     }
     if(valor_1[0]=='4') {
      this.puntaje_obtenido=4;
     }
     if(valor_1[0]=='5') {
      this.puntaje_obtenido=5;
     }
    }
    console.log('el valor puntaje');
    console.log(this.puntaje_obtenido);
  }
/***********************************/
comentarios(){
    let modal = this.modalCtrl.create('ModalcomentariosPage');
    modal.onDidDismiss(data => {
      console.log('algo aqui');
    });
    modal.present();
}
 estado_servicio(){
   let data:any=this.prlogin.getMyGlobalVar();
   let id_usuario=data.json().id_usuario;
    this.id_servicio=this.result.id_servicio;
     this.conexion.conexion();
    let status=this.prlogin.get_variable_status_conexion();
    /*verifica si hay internet*/
    if(status=='desconectado') {
    }else{
   this.prservicio.set_id_servicio(this.id_servicio);
    console.log('para el estado de servicio');
   clearInterval(this.intervalo_estado_servicio);
   let _token:any='5oJn^ixsIp~ltoEnXia^Iv[wIhiy]R0TkH6G';
    this.prservicio.get_servicio_abierto_id_usuario(id_usuario,this.id_servicio,_token).subscribe(
       prservicio => {
         this.result_2=prservicio;
         let id_status_servicio;
          for(let value of this.result_2) {
           id_status_servicio=value.id_status_servicio;
           this.observaciones_conductor=value.observacion_conductor;
          }
          
          if(id_status_servicio=='6') {
            console.log('si es 6');
                /*si ya la carrera se realizó*/
                clearInterval(this.intervalo_estado_servicio);
              this.pagar_servicio();
           }else{
             if(id_status_servicio=='3') {
               this.variable_content='';
               this.buttonDisabled=true;
               console.log('entra de nuevo en el bucle del intervalo porque no lo consiguió');
               this.estado_servicio_contador();
             }else{
               if(id_status_servicio=='4') {
                 /*lo envia a esta funcion*/
                  clearInterval(this.intervalo_estado_servicio);
                  this.problema_servicio();
               }else{
                 console.log('entra de nuevo en el bucle del intervalo porque no lo consiguió');
                 this.estado_servicio_contador();
               }
             }
           }
       },
       err => {console.log("NO EXISTE REGISTRO");
       },
   );
  }
 }
   pagar_servicio(){
    console.log('busca el monto de la carrera');
     let _token:any='5oJn^ixsIp~ltoEnXia^Iv[wIhiy]R0TkH6G';
      let data_2:any=this.prservicio.get_id_servicio();
      let id_servicio=data_2;
       this.prservicio.get_servicio_abierto_id_usuario_monto(id_servicio,_token).subscribe(
          prservicio => {
            this.result_monto=prservicio;
             console.log("REGISTRO EXISTE");
             this.prservicio.set_datos_monto(this.result_monto);
              console.log('entra en pagar_servicio');
              this.nav.setRoot('PaymentMethodPage');
          },
          err => {console.log("NO EXISTE REGISTRO");
          },
      );
  }
   /* aqui el verifica el problema del servicio y lo saca al home*/
   problema_servicio(){
    let alert = this.alertCtrl.create({
            title: 'Informacion',
            subTitle: 'El conductor ha cancelado la carrera, Motivo: '+this.observaciones_conductor,
            buttons: ['OK']
            });
            alert.present();
    console.log('ocurre el problema del servicio');
     this.nav.setRoot('HomePage');
  }   
/*fin*/
  abrir_mapa() {
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
        this.prservicio.set_variable_cambio_tracking(1);
        this.nav.setRoot('TrackingPage');
     }
  }
}
