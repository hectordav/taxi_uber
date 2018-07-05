import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage,ToastController } from 'ionic-angular';
import {Prlogin} from "../../providers/prlogin";
import {Prservicio} from "../../providers/prservicio";
import {PrconexionProvider} from "../../providers/prconexion/prconexion";


@IonicPage()
@Component({
  selector: 'page-cancelarsolicitud',
  templateUrl: 'cancelarsolicitud.html'
})
export class CancelarsolicitudPage {
	id_servicio:any;
  observacion_conductor:any;
  result:any;
  result_cancelar_carrera:any;
  status:any;
  variable_cancela_driver:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public prlogin:Prlogin, public prservicio:Prservicio,public conexion:PrconexionProvider,private toastCtrl: ToastController) {
    this.variable_cancela_driver=this.prservicio.get_variable_cancela_driver();
  }

  cancelar_solicitud_taxi_confirmado(){
      this.conexion.conexion();
    this.status=this.prlogin.get_variable_status_conexion();
    /*verifica si hay internet*/
    if(this.status=='desconectado') {
      let toast = this.toastCtrl.create({
        message: 'Verifique la conexion a internet.',
        duration: 3500,
        position: 'bottom'
        });
      toast.present();
    }else{
      let data:any=this.prlogin.getMyGlobalVar();

      let _id_usuario:any=data.json().id_usuario;
      let _observacion_cliente:any=this.observacion_conductor;
      let _token:any='5oJn^ixsIp~ltoEnXia^Iv[wIhiy]R0TkH6G';
      if(this.variable_cancela_driver==0) {
        this.prservicio.cancelar_solicitud_taxi(_id_usuario,_observacion_cliente,_token).subscribe(
        prservicio => {
          this.result=prservicio;
           console.log("REGISTRO EXISTE");
           this.navCtrl.setPages([{ page: 'HomePage' }]);
        },
        err => {console.log("NO EXISTE REGISTRO");
         },
      );
      }else{
        let data_2:any=this.prservicio.get_datos_servicio_global();
        let id_servicio;
         for(let value of data_2) {
          id_servicio=value.id_servicio;
         }
        this.prservicio.cancelar_solicitud_taxi_id_servicio(id_servicio,_observacion_cliente,_token).subscribe(
          prservicio => {
            this.result=prservicio;
             console.log("REGISTRO EXISTE");
             this.prservicio.set_variable_cancela_driver(0);
             this.navCtrl.setPages([{ page: 'HomePage' }]);
          },
          err => {console.log("NO EXISTE REGISTRO");
           },
        );
        
      }
    }
  }


}
