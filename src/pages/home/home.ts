import {Component} from '@angular/core';
import {NavController, Platform, AlertController,ModalController,IonicPage,ToastController,LoadingController} from 'ionic-angular';
import {Prlogin} from "../../providers/prlogin";
import {Prservicio} from "../../providers/prservicio";
import {Prconductores} from "../../providers/prconductores";
import { Geolocation} from '@ionic-native/geolocation';
import {NativeGeocoder,NativeGeocoderReverseResult} from '@ionic-native/native-geocoder';
import {GoogleMapsLatLng} from 'ionic-native';
import {PrconexionProvider} from "../../providers/prconexion/prconexion";
import SlidingMarker from "marker-animate-unobtrusive";
declare var google: any;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // map id
  public mapId = Math.random() + 'map';

  // map height
  public mapHeight: number = 480;

  // show - hide booking form
  public showForm: boolean = false;

  // show - hide modal bg
  public showModalBg: boolean = false;
  public render = new google.maps.DirectionsRenderer();
  public directionsService= new google.maps.DirectionsService;
  
   /*las notas del conductor*/
  public notas:any='';

  // Map
  public map: any;
  address:any = {
    place: '',
    set: false,
    };
  address_2:any = {
    place: '',
    set: false,
    };
  /*las coordenadas del usuario*/
    g_latitud:any;
    g_longitud:any;

    intervalo:any;
    intervalo_2:any;
    los_marcadores:any;
    marcadores:any;
    results_2:any;
    carga_mapas:any;
    backPressed:any=false;
    loader:any;
    lati_long:any;
    g_distancia:any;
    result_2:any;
    placesService:any;
    placedetails: any;
    g_lat_i:any;
    g_lng_i:any;
    g_lat_f:any;
    g_lng_f:any;
    distancia:any=null;
    duracion:any;
    precio_tarifa:any;
    precio_minuto:any;

    result_tarifa:any;
    result_banderazo:any;

    result_minuto:any;
    calculo_tarifa:any;
    position_2:any;
    nueva_posicion:any;
    mark_array:any[]=[];
    cambio_marker=0;
    precio_banderazo:any;
  constructor(public nav: NavController, public platform: Platform, public alertCtrl: AlertController,public modalCtrl: ModalController,public login: Prlogin, public prservicio:Prservicio, public geolocation: Geolocation, public geocode:NativeGeocoder, public conductores:Prconductores,private toastCtrl: ToastController, public conexion:PrconexionProvider, public loadingCtrl:LoadingController) {
      /*****back button*****/
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
     /*/backbutton*/
    // when platform ready, init map
    platform.ready().then(() => {
      console.log('ready');
        setTimeout(() => {
        this.initializeMap();
        }, 2000);
        this.intervalo=setInterval(() => {
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
             this.obtener_markers();   
          }
        }, 7000);
        
    });
    this.distancia_taxi_cliente();
    this.get_tarifa();
    this.get_banderazo();
  }
  get_banderazo(){
    this.prservicio.get_banderazo().subscribe(
        prservicio => {
          this.result_banderazo=prservicio;
           for(let value of this.result_banderazo) {
            this.precio_banderazo=value.monto;
           }
           console.log('consigue el banderazo');
           
        },
        err => {console.log("NO EXISTE REGISTRO");
        },
    );
  }
  get_tarifa(){
     this.prservicio.get_tarifa().subscribe(
        prservicio => {
          this.result_tarifa=prservicio;
           console.log("REGISTRO EXISTE");
          this.precio_tarifa=prservicio.json().precio;
         console.log(this.precio_tarifa);
         this.get_precio_minuto();
        },
        err => {console.log("NO EXISTE REGISTRO");
        },
    );
  }
    get_precio_minuto(){
     this.prservicio.get_precio_minuto().subscribe(
        prservicio => {
          this.result_minuto=prservicio;
           console.log("REGISTRO EXISTE");
           for(let value of this.result_minuto) {
              this.precio_minuto=value.precio;
           }
        },
        err => {console.log("NO EXISTE REGISTRO "+err);
        },
    );
  }

  salir_sistema(){
          this.loader= this.alertCtrl.create({
             title: 'Confirmar',
          message: 'Esta accion cerrará el sistema, desea continuar?',
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
                 this.platform.exitApp();
              }
            }
          ]
         });
      this.loader.present();  
   
  }

  /***************obtener markers******************/
   obtener_markers() {
   console.log('entra en obtener markers');
   let _token:any='5oJn^ixsIp~ltoEnXia^Iv[wIhiy]R0TkH6G';
        this.prservicio.get_ultima_ubicacion_taxista_hoy(_token).subscribe(
           prservicio => {
             this.los_marcadores=prservicio;
             console.log(this.los_marcadores);
             if(this.cambio_marker==0) {
               this.agregar_marker(prservicio);
               this.cambio_marker=1;
             }else{
               this.actualiza_markers();
             }
             console.log("REGISTRO EXISTE en marcadores los marcardores"); 
             console.log(prservicio);            
           },
           err => {console.log("NO EXISTE REGISTRO");
           },
       );
  }


  /*************** agregar markers*******************/
  agregar_marker(item) {
    let markers=item;
   
   if(markers) {
     console.log('los monta');
    /*le monto un array para poder hacer el for*/
    let customMarker = "assets/img/taxi_pin_2.png";
    let i=0;
     for(let marker of markers) {
       let Lat_lng:any=marker.lat_lng.split(',');
       let lat_inicio:any=parseFloat(Lat_lng[0]);
       let lng_inicio:any=parseFloat(Lat_lng[1]);
       var position = new google.maps.LatLng(lat_inicio,lng_inicio);
          this.mark_array[i] = new SlidingMarker({
          position: position,
          title: 'el marcador',
          icon: customMarker});
          /*lo coloco fuera porque asi lo llama directo por cada marker*/
          this.mark_array[i].setMap(this.map);
          this.mark_array[i].setDuration(5000);
          this.mark_array[i].setEasing('linear');
          console.log("entra en el for");
       i++;
      }
     }
  }
  actualiza_markers(){
    if(this.los_marcadores){
      let i=0;
      for(let marker of this.los_marcadores) {
       let Lat_lng:any=marker.lat_lng.split(',');
       let lat_inicio:any=parseFloat(Lat_lng[0]);
       let lng_inicio:any=parseFloat(Lat_lng[1]);
       var position = new google.maps.LatLng(lat_inicio,lng_inicio);
        this.mark_array[i].setPosition(position);
      }
    }
  }

  // toggle form
  toggleForm() {
    this.showForm = !this.showForm;
    this.showModalBg = (this.showForm == true);
    this.calculo_de_distancia();
     
  }

/*******************Carga  el mapa*******************/
  initializeMap() {
   let datos=this.login.getMyGlobalVar();
   let id_usuario=datos.json().id_usuario;
   let latLng = new google.maps.LatLng(25.686614, -100.316113);
   let _token:any='5oJn^ixsIp~ltoEnXia^Iv[wIhiy]R0TkH6G';
    let mapOptions = {
      center: latLng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false
    }

    this.map = new google.maps.Map(document.getElementById(this.mapId), mapOptions);

    // get ion-view height
    var viewHeight = window.screen.height - 44; // minus nav bar
    // get info block height
    var infoHeight = document.getElementsByClassName('booking-info')[0].scrollHeight;
    // get booking form height
    var bookingHeight = document.getElementsByClassName('booking-form')[0].scrollHeight;

    // set map height = view height - info block height + booking form height
    this.mapHeight = viewHeight - infoHeight + bookingHeight;

    let options = {timeout: 120000, enableHighAccuracy: true};

    // refresh map
    setTimeout(() => {
      google.maps.event.trigger(this.map, 'resize');
    }, 300);

    // use GPS to get center position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let newLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
       
         var pinImage ="assets/img/cliente_pin.png";
        this.map.setCenter(newLatLng);
        new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          icon: pinImage,
          position: this.map.getCenter()
        });
        
        console.log('aqui guardo las coordenadas del cliente');
        this.g_latitud=position.coords.latitude;
        this.g_longitud=position.coords.longitude;
        let lat_lng=this.g_latitud+','+this.g_longitud;
        this.lati_long=lat_lng;
        this.login.guardar_ubicacion(id_usuario,lat_lng, _token).subscribe(
                login => {
                   console.log("ubicacion guardada");
                     setTimeout(() => {
                      this.la_direccion();
                      }, 2000);
                },
                err => {console.log("NO EXISTE REGISTRO");
                },
            );
      
      },

      (error) => {
        console.log(error);
      },
      options
    );

  }
  /**************fin carga mapa************************/
/*muestra la direccion en el imput "desde" en home html */
la_direccion(){
  console.log('entra en la direccion');
  this.g_lat_i=this.g_latitud;
  this.g_lng_i=this.g_longitud;
 
   this.geocode.reverseGeocode(this.g_latitud,this.g_longitud)
        .then((result: NativeGeocoderReverseResult) => {
         this.address.place =result.thoroughfare+', '+result.locality+', '+result.subAdministrativeArea;
        /* alert(this.address.place);*/
        })
        .catch((error: any) => console.log(error));
}
/************************************************************/
  /****************notas al conductor****************/
  showNotePopup() {
    let prompt = this.alertCtrl.create({
      title: 'Notas al Conductor',
      message: "",
      inputs: [
        {
          name: 'note',
          placeholder: 'Note'
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
            this.notas=data;
            console.log('Saved clicked');
          }
        }
      ]
    });
   prompt.present();
  };

/**********************solicita la carrera*********************/
solicitar_carrera(){
     let _inicio:any=this.address.place;
     let _fin:any=this.address_2.place;
     let _notas:any= this.notas['note'];
     let _datos_login:any= this.login.getMyGlobalVar();
     let _id_usuario:any=_datos_login.json().id_usuario;
     let _id_tipo_servicio:number=1;
     let _lat_lng_i=this.g_lat_i+','+this.g_lng_i;
     let _lat_lng_f=this.g_lat_f+','+this.g_lng_f;
     this.calculo_de_distancia();
     let _token:any='5oJn^ixsIp~ltoEnXia^Iv[wIhiy]R0TkH6G';
     if(_notas==undefined) {
       _notas='ninguna';
     }
      let _id_status_servicio:any=1;
      
       if(this.address.place=='') {
         let alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: 'Debe ingresar una direccion de Inicio',
              buttons: ['OK']
              });
              alert.present();  
       }else{
         if(this.address_2.place=='') {
            let alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: 'Debe ingresar una direccion Final',
              buttons: ['OK']
              });
              alert.present();  
           }else{
             this.calculo_tarifa=null;
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
                  this.presentLoading();
                 setTimeout(()=>{
                   this.prservicio.solicitar_servicio(_inicio,_fin,_lat_lng_i,_lat_lng_f,_notas,_id_usuario,_id_tipo_servicio,_id_status_servicio,_token,this.calculo_tarifa).subscribe(
                     prservicio => {
                     this.results_2=prservicio;
                     console.log(this.results_2);
                      for(let value of  this.results_2) {
                        console.log(value.id_servicio);
                       this.prservicio.set_id_servicio(value.id_servicio);
                      }
                     console.log('entra hasta aqui');
                     console.log('la tarifa '+this.calculo_tarifa);
                     clearInterval(this.intervalo);
                     clearInterval(this.intervalo_2);
                     this.nav.setRoot('FindingPage'); 
                     },
                     err => {console.log(err);});
                  this.loader.dismiss();
                 },4000);
                  // go to finding page
                  clearInterval(this.intervalo);  
                }

          /**/
        }
      }
    }
presentLoading() {
        this.loader = this.loadingCtrl.create({
            content: "Creando Carrera"
        });
        this.loader.present();
    }
 /****************************autocompletar**********************************************/
 showAddressModal () {
    let modal = this.modalCtrl.create('AutocompletePage');
    modal.onDidDismiss(data => {
      this.address.place = data.description;
      console.log(data);
      /*ver el detalle de la direccion:*/
      this.getPlaceDetail_i(data.place_id);

    });
    modal.present();
  }
   showAddressModal_2 () {
     let modal = this.modalCtrl.create('AutocompletePage');
    modal.onDidDismiss(data => {
      this.address_2.place = data.description;
      /*ver el detalle de la direccion:*/
      this.getPlaceDetail_f(data.place_id);

    });
    modal.present();
  }
 /*aqui tomo latitud y longitud del autocomplete*/
  private getPlaceDetail_i(place_id:string):void {
        var self = this;
        var request = {
            placeId: place_id
        };
        this.placesService = new google.maps.places.PlacesService(this.map);
        this.placesService.getDetails(request, callback);
        function callback(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                console.log('page > getPlaceDetail > place > ', place);
                // set full address
               /* self.placedetails.address = place.formatted_address;*/
/*                let algo=place.formatted_address;
*/              console.log(place.geometry.location.lat());
                self.g_lat_i= place.geometry.location.lat();
                self.g_lng_i= place.geometry.location.lng();
                console.log(self.g_lat_i);
                console.log(self.g_lng_i);
                self.address.set = true;
                console.log('page > getPlaceDetail > details > ', self.placedetails);
            }else{
                console.log('page > getPlaceDetail > status > ', status);
            }
        }
    }
     private getPlaceDetail_f(place_id:string):void {
        var self = this;
        var request = {
            placeId: place_id
        };
        this.placesService = new google.maps.places.PlacesService(this.map);
        this.placesService.getDetails(request, callback);
        function callback(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                console.log('page > getPlaceDetail > place > ', place);
                // set full address
               /* self.placedetails.address = place.formatted_address;*/
/*                let algo=place.formatted_address;
*/                self.g_lat_f=place.geometry.location.lat();
                self.g_lng_f=place.geometry.location.lng();
                console.log(self.g_lat_f);
                console.log(self.g_lng_f);
                self.address.set = true;
                console.log('page > getPlaceDetail > details > ', self.placedetails);

            }else{
                console.log('page > getPlaceDetail > status > ', status);
            }
        }
   
    }
  /*busca la distancia entre taxi_cliente para meterlo en la parte del maker */
  distancia_taxi_cliente(){
     this.conductores.get_distancia_taxi_cliente().subscribe(
        conductores => {
          this.result_2=conductores;
           console.log("REGISTRO EXISTE");
       this.g_distancia=conductores.json().distancia;
         
        },
        err => {console.log("NO EXISTE REGISTRO");
        },
    );
  }

 /*aqui calcula el precio de la distancia:*/
   calcular_distancia_tiempo(){
    console.log("entra en Calulcar Ruta");
    let data:any=this.login.getMyGlobalVar();
    let id_usuario=data.json().id_usuario;
    console.log("sacando el dato");
    console.log(id_usuario);
    console.log("entro en calcular ruta");
    let lat_i:any=parseFloat(this.g_lat_i);
    let lng_i:any=parseFloat(this.g_lng_i);
    let lat_f:any=parseFloat(this.g_lat_f);
    let lng_f:any=parseFloat(this.g_lng_f);
    let inicio=new GoogleMapsLatLng(lat_i,lng_i);
    let fin=new GoogleMapsLatLng(lat_f,lng_f);
    let panel = document.getElementById('panel'); 
    let directionsDisplay = null;
            directionsDisplay = this.render;
            /*el panel que tengo en el html OJO debe ir*/
     document.getElementById("panel").innerHTML = "";
     console.log('entro en panel');
            /*directionsDisplay.setMap(this.map);*/
            directionsDisplay.setPanel(panel);
      this.directionsService.route({
        origin: inicio,
        destination: fin,
        travelMode: google.maps.TravelMode.DRIVING
      },(response,status)=>{
        console.log('entro en response status');  
        let distance = null;
        let duration=null;
        if(status === google.maps.DirectionsStatus.OK) {
        /*este muestra la ruta marcada*/
          directionsDisplay.setDirections(response);
         let leg = response.routes[ 0 ].legs[ 0 ];
         console.log('en leg');
         console.log(leg);
        let legs = response.routes[0].legs;
        distance = legs[0].distance.text;
        duration = legs[0].duration.text;
        this.distancia=distance;
        this.duracion=duration;
        console.log('la distancia calculada');
        console.log(this.distancia);
        console.log(this.duracion);
          /* directionsDisplay.setMap(this.map);*/
        }else{
          console.log('no va pal baile');
        } 
      }, err => {console.log(err);
        alert(err);
            },)  
  }
  calculo_de_distancia(){
    setTimeout(() =>this.calcular_distancia_tiempo()
      , 4000);

      setTimeout(() =>this.calculo_precio_distancia()
      , 4000);
  }

  /*aqui calcula el precio de la tarifa aproximado*/
  calculo_precio_distancia(){
    if(this.distancia==null) {
     this.distancia="Calculando";
    }else{
    let _data_distancia=this.distancia.split(' ');
    let _data_duracion=this.duracion.split(' '); /*1*/
    let _distancia_val=_data_distancia[0];
    let _distancia_unidad=_data_distancia[1];
    /*toma el valor de minutos por el split 1*/
    let _minuto_unidad=_data_duracion[0];
    let _precio_tarifa=(this.precio_tarifa)/1000;
    console.log(_precio_tarifa);
    let _km:any;
    if (_distancia_unidad=='m') {
          _km=_distancia_val/1000;
        }else{
          _km=_distancia_val;
        }
    if(_km.length>2) {
      console.log('entro en el leng');
      if(_km.indexOf(',') != -1) {
       /*existe una coma*/
        let data_km=_km.split(',');
        let km_1=data_km[0];
        let km_2=data_km[1];
        let _km_total=(km_1+km_2)*100;
        console.log(_km_total);
        let calculo_minuto=_minuto_unidad*this.precio_minuto;
        let _calculo_tarifa=_km_total*_precio_tarifa;
        this.calculo_tarifa=Math.round((_calculo_tarifa+calculo_minuto)* 100) / 100;
        console.log('él calculo '+this.calculo_tarifa);
      }else{
        if(_km.indexOf('.') != -1) {
          let data_km=_km.split('.');
        let km_1=data_km[0];
        let km_2=data_km[1];
          let _km_total=(km_1+km_2)*100;
        console.log(_km_total);
        let calculo_minuto=_minuto_unidad*this.precio_minuto;
        let _calculo_tarifa=_km_total*_precio_tarifa;
       this.calculo_tarifa=Math.round((_calculo_tarifa+calculo_minuto)* 100) / 100;
        console.log('él calculo '+this.calculo_tarifa);
        }else{
          let _calculo_tarifa=_km*_precio_tarifa;
          let calculo_minuto=_minuto_unidad*this.precio_minuto;
          this.calculo_tarifa=Math.round((_calculo_tarifa+calculo_minuto) * 100) / 100;
          console.log('él calculo '+this.calculo_tarifa);
        }
      }
    }else{
      console.log('entro en el else ultimo');
      let _calculo_tarifa=_km*_precio_tarifa;
      this.calculo_tarifa==Math.round(_calculo_tarifa* 100) / 100;
      console.log('él calculo '+this.calculo_tarifa);
    }
   }
  }
 /*****************************************/
}
