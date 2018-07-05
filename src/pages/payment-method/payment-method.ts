import {Component} from '@angular/core';
import {IonicPage,NavController,AlertController,Platform} from 'ionic-angular';
import {Prlogin} from "../../providers/prlogin";
import {Prservicio} from "../../providers/prservicio";
import {PrtipopagoProvider} from "../../providers/prtipopago/prtipopago";

@IonicPage()
@Component({
  selector: 'page-payment-method',
  templateUrl: 'payment-method.html'
})
export class PaymentMethodPage {
	  public tipo_pago_icono: any = [
    {
      id:'1',
      name: 'Efectivo',
      icon: 'icon-cash',
      active: true
    },
    {
      id:'3',
      name: 'Codigo Promo',
      icon: 'icon-pricetags',
      active: false
    }
  ]
  result:any;
	result_2:any;
	g_select:number;
	id_usuario_conductor:any;
	id_usuario:any;
	monto:any;
	codigo_promo:any;
	tipopago:any;
	result3:any;
  valor_id_tipo_pago:any;
  backPressed:any=false;
  loader:any;
   // list tipo_pago
  result_monto:any={
    id_usuario_conductor:'',
    monto:''
  };
  constructor(public nav: NavController,public login:Prlogin, public servicio:Prservicio,public tipo_pago:PrtipopagoProvider,public alertCtrl: AlertController,public platform: Platform) {
 
      this.buscar_monto();
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

  // apply change method
  changeMethod(method) {
    // go back
    this.nav.pop();
  }
    buscar_monto(){
  	let datos_monto=this.servicio.get_datos_monto();
     for(let value of datos_monto) {
      this.result_monto.id_usuario_conductor=value.id_usuario_conductor;
      let monto=value.monto;
      this.result_monto.monto=Math.round((monto)*100)/100;
     }
    }

    pagar_carrera(){
     let _id_usuario_conductor:any=this.result_monto.id_usuario_conductor;
     this.id_usuario_conductor=_id_usuario_conductor;
     this.g_select;
     let _monto:any=  this.result_monto.monto;
     this.servicio.set_id_taxista(_id_usuario_conductor);
     this.monto=_monto;
   /* let select_tipo_pago:any=this.g_select;*/
       if(this.g_select==null) {
         let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'Debe Seleccionar un Metodo de pago',
          buttons: ['OK']
          });
          alert.present();  
       }else{
         if(this.g_select==1) {
           this.servicio.set_id_taxista(_id_usuario_conductor);
                /*envia a calificar*/
            this.showRating();
         }else{
           if(this.g_select==2) {
         /*  this.pago_paypal();*/
           }else{
            if(this.g_select==3) {
           this.codigo_promo_show();
            }
           }
         }
       }
  }
    codigo_promo_show() {
    let prompt = this.alertCtrl.create({
      title: 'Ingrese Codigo',
      message: "",
      inputs: [
        {
          name: 'note',
          placeholder: 'Codigo Promocion'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.codigo_promo=data;
            console.log(this.codigo_promo);
            this.verificar_codigo_promo();       
          }
        }
      ]
    });
    prompt.present();
  }
     cancelar_solicitud_taxi(){
      this.loader= this.alertCtrl.create({
             title: 'Confirmar',
          message: 'Ya ha llegado a su destino pero falta la opcion de pago, realmente desea salir?',
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
    verificar_codigo_promo(){
    let _codigo:any=this.codigo_promo['note'];
    let _monto:string=this.monto;
    let _id_usuario:any=this.id_usuario;
    let _token:any='5oJn^ixsIp~ltoEnXia^Iv[wIhiy]R0TkH6G';
         this.tipopago.verificar_codigo_promo(_codigo,_monto,_id_usuario,_token).subscribe(
            tipopago => {
              this.result3=tipopago;
               console.log("valor de codigo de promo");
               if(tipopago.json().id=='1') {
                let alert = this.alertCtrl.create({
                     title: 'Error',
                     subTitle: 'Codigo Promocion ya fue usado',
                     buttons: ['OK']
                     });
                   alert.present();
               }else{
                 if(tipopago.json().id=='2') {
                   let alert = this.alertCtrl.create({
                     title: 'Error',
                     subTitle: 'Monto menor al Valor de la carrera',
                     buttons: ['OK']
                     });
                   alert.present();
                 }else{
                   if(tipopago.json().id=='3') { 
                     let alert = this.alertCtrl.create({
                        title: 'Pago Exitoso',
                        subTitle: 'Codigo Registrado Satisfactoriamente',
                        buttons: ['OK']
                        });
                     alert.present(); 
                     this.showRating();
                   }else{
                     if(tipopago.json().id=='4') {
                      let alert = this.alertCtrl.create({
                     title: 'Error',
                     subTitle: 'Codigo no existe',
                     buttons: ['OK']
                     });
                   alert.present();
                     }
                   }
                 }
               }
            },
            err => {console.log("NO EXISTE REGISTRO");
            },
        );
  }
 // show rating popup
  showRating() {
    let prompt = this.alertCtrl.create({
      title: 'Muchas Gracias',
      message: 'Esperamos que haya disfrutado de nuestro servicio Para Calificar haga clic en el boton "Calificar Servicio',
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
            this.nav.setRoot('HomePage');
          }
        },
        {
          text: 'Calificar Servicio',
          handler: data => {
            console.log('Saved clicked');
            this.nav.setRoot('ModalRatingPage');
          }
        }
      ]
    })

    prompt.present();
  }
 /* pago_paypal(){
    let data:any=this.servicio.get_datos_taxista_global();
    let _monto:any=data['monto'];
    let _descripcion:string='Pago de Carrera';
    this.payPal.init({
  PayPalEnvironmentProduction: "YOUR_PRODUCTION_CLIENT_ID",
  PayPalEnvironmentSandbox: "AXfL5Lpi84h-jPipu18rYGqYfxWb4yQPF6MZsPJUkVIA2e3ZuWxvi_7ucOrD43VoeYDL69BXZwhiuvrk"
}).then(() => {*/

  // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction

 /* this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({*/
    // Only needed if you get an "Internal Service Error" after PayPal login!
    //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal


 /* })).then(() => {
    let payment = new PayPalPayment(_monto, 'USD', _descripcion, 'sale');
    this.payPal.renderSinglePaymentUI(payment).then(() => {*/
      /*si pasa el pago: */
      

      /* let alert = this.alertCtrl.create({
            title: 'Pago Exitoso',
            subTitle: 'Pago Registrado Satisfactoriamente',
            buttons: ['OK']
            });
         alert.present(); 
       this.showRating();
    }, () => {*/
      // Error or render dialog closed without being successful
  
  /*  });
  }, () => {*/


    // Error in configuration


/*  });
}, () => {*/


  // Error in initialization, maybe PayPal isn't supported or something else

/*});
  }*/
}
