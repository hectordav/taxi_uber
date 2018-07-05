import { Component } from '@angular/core';
import { NavController, Platform, AlertController,IonicPage,ToastController } from 'ionic-angular';
import { DriverService } from '../../services/driver-service';
import {Prlogin} from "../../providers/prlogin";
import {Prservicio} from "../../providers/prservicio";
import {GoogleMapsLatLng} from 'ionic-native';
import {PrconexionProvider} from "../../providers/prconexion/prconexion";
declare var google: any;

@IonicPage()
@Component({
  selector: 'page-tracking',
  templateUrl: 'tracking.html'
})
export class TrackingPage {
  // map height
  public mapHeight:number = 480;

  // driver info
  public driver:any;
  // map
  public map:any;
  public directionsService= new google.maps.DirectionsService;
  public my_route:any;
  public render = new google.maps.DirectionsRenderer();
/*  public marcador_carro:any;*/
  /*public carmarkers:any;*/
  public result:any;
  datos_taxista:any={
    adjunto:'',
    telf:'',
    nombre:'',
    lat_lng_i:'',
    lat_lng_f:''
  };
  lat_tax:any;
  lng_tax:any;
  lat_usuario:any;
  lng_usuario:any;
  pinA:any;
  pinB=[];
  intervalo:any;
  distancia:any;
  duracion:any;
  result_2:any;
  backPressed:any=false;
  loader:any;
  temporal:any=0;
  variable_cambio;
  cabecera:any;
  marker:any={
    m1:'',
    m2:''
  }
  intevalo_estado_servicio:any;

  constructor(public nav: NavController, public driverService:DriverService, public platform:Platform,public alertCtrl: AlertController, public login:Prlogin, public servicio:Prservicio,private toastCtrl: ToastController, public conexion:PrconexionProvider) {
    // get driver info
    this.driver = driverService.getItem(1);
    this.estado_servicio_contador();
    this.variable_cambio=this.servicio.get_variable_cambio_tracking();
    if(this.variable_cambio==0) {
       this.cabecera='Conductor en Camino';
    }else{
      this.cabecera='Ruta a su Destino';
    }
    this.directionsService= new google.maps.DirectionsService();
    this.datos_carrera();
    // when platform ready, init map
    platform.ready().then(() => {
      // init map
       setTimeout(() => {
        this.initializeMap();
        }, 2000);
    });

      /*****back button*****/
     platform.registerBackButtonAction(() => {
         if (this.nav.canGoBack()) {
          this.nav.pop()
          return;
        }
        if(!this.backPressed) {
          this.backPressed = true
          this.regreso_driver();
          setTimeout(() => this.backPressed = false, 2000)
          return;
        }else{
        
        }
      });
     /*/backbutton*/
  }
  regreso_driver(){
    this.nav.setRoot('DriverPage');
  }
  estado_servicio_contador(){
     this.intevalo_estado_servicio=setInterval(()=>{ this.estado_servicio()},10000);
  }
  datos_carrera(){
    let data=this.servicio.get_datos_servicio_global();
     for(let value of data) {
       this.datos_taxista.adjunto=value.adjunto;
       this.datos_taxista.nombre=value.nombre;
       this.datos_taxista.telf=value.telf;
       this.datos_taxista.lat_lng_i=value.lat_lng_i;
       this.datos_taxista.lat_lng_f=value.lat_lng_f;
     }
     
  }

  initializeMap() {
    let latLng = new google.maps.LatLng(21.0318202, 105.8495298);
    let mapOptions = {
      center: latLng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false
    }

    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // get ion-view height
    var viewHeight = window.screen.height - 44; // minus nav bar
    // get info block height
    var infoHeight = document.getElementsByClassName('tracking-info')[0].scrollHeight;

    this.mapHeight = viewHeight - infoHeight;

    let options = {timeout: 120000, enableHighAccuracy: true};

    navigator.geolocation.getCurrentPosition(
      (position) => {
        let newLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.map.setCenter(newLatLng);
        /*new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: this.map.getCenter()
        });*/
      },

      (error) => {
        console.log(error);
      }, options
    );

    // refresh map
    setTimeout(() => {
      google.maps.event.trigger(this.map, 'resize');
    }, 300);
     this.intervalo=setInterval(() => {
        this.conexion.conexion();
    let status=this.login.get_variable_status_conexion();
    /*verifica si hay internet*/
    if(status=='desconectado') {
      let toast = this.toastCtrl.create({
        message: 'Verifique la conexion a internet, no podemos calcular la ruta',
        duration: 3500,
        position: 'bottom'
        });
      toast.present();
    }else{
      if(this.variable_cambio==0) {
      this.calcular_ruta();
      }else{
        this.calcular_ruta_destino();
      }
     }
    }, 3000);
  }

  calcular_ruta(){
    console.log("entra en Calulcar Ruta");
    let data:any=this.login.getMyGlobalVar();
    let id_usuario=data.json().id_usuario;
    let _token:any='5oJn^ixsIp~ltoEnXia^Iv[wIhiy]R0TkH6G';
    console.log("sacando el dato");
    console.log(id_usuario);
    /*utilizo la misma funcion ya que tomo el id usuario y el taxista*/
     /*la ubicacion del cliente*/
      this.servicio.get_ubicacion_taxista(id_usuario,_token).subscribe(
            servicio => {
              this.result=servicio;
               console.log("REGISTRO EXISTE servicio");
            /*  let items = servicio.json();*/
            console.log(servicio);
            
              console.log("guarda el result en latlng");
              this.servicio.set_lat_lng(this.result);
              console.log('el result'+this.result);
              
               let datos_2:any=this.servicio.get_lat_lng();
                console.log('lat');
                console.log(datos_2);
                this.lat_usuario=datos_2.json().lat;
                console.log(this.lat_usuario);
                console.log('lng');
                this.lng_usuario=datos_2.json().lng;
                console.log(this.lng_usuario);
            },
            err => {console.log("NO EXISTE REGISTRO");
            console.log(err);  
            },
        );
    /*la ubicacion del taxista*/
    let id_taxista:any=this.servicio.get_id_taxista();
         this.servicio.get_ubicacion_taxista(id_taxista,_token).subscribe(
            servicio => {
              this.result=servicio;
               console.log("REGISTRO EXISTE");
            /*  let items = servicio.json();*/
              console.log("guarda el result en latlng");
              this.servicio.set_lat_lng(this.result);
               let datos:any=this.servicio.get_lat_lng();
                console.log('lat');
                this.lat_tax=datos.json().lat;
                console.log( this.lat_tax);
                console.log('lng');
                this.lng_tax=datos.json().lng;
                console.log(this.lng_tax);
            },
            err => {console.log("NO EXISTE REGISTRO");
            },
        );
     /*************************************************/
    let lat_usuario:any=parseFloat(this.lat_usuario);
    let lng_usuario:any=parseFloat(this.lng_usuario);
    let lat_taxi:any=parseFloat(this.lat_tax);
    let lng_taxi:any=parseFloat(this.lng_tax);
    console.log("entro en calcular ruta");
    let inicio=new GoogleMapsLatLng(lat_usuario, lng_usuario);
    let fin=new GoogleMapsLatLng(lat_taxi, lng_taxi);
    let panel = document.getElementById('panel'); 
    var icono_pasajero ="assets/img/cliente_pin.png";
    let icono_taxi = "assets/img/taxi_pin_2.png";
    let directionsDisplay = null;
            directionsDisplay = this.render;
            /*el panel que tengo en el html OJO debe ir*/
     document.getElementById("panel").innerHTML = "";
     console.log('entro en panel');
      directionsDisplay.setMap(this.map);
      directionsDisplay.setOptions( { suppressMarkers: true } );
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
        this.makeMarker_1(leg.start_location,icono_pasajero, "algo 1" );
        this.makeMarker_2(leg.end_location, icono_taxi, 'algo 2' );
        if(this.distancia && this.temporal==0) {
         clearInterval(this.intervalo); 
         this.temporal=1;
         setTimeout(()=>{
         this.calcular_ruta_tiempo();
         },10000);
        }
          /* directionsDisplay.setMap(this.map);*/
        }else{
          console.log('no va pal baile');
        } 
      }, err => {console.log(err);
        alert(err);
            },)
  }
   calcular_ruta_destino(){
    console.log("entra en Calulcar Ruta destino");
    let data:any=this.login.getMyGlobalVar();
    let id_usuario=data.json().id_usuario;
    let _token:any='5oJn^ixsIp~ltoEnXia^Iv[wIhiy]R0TkH6G';
    console.log("sacando el dato");
    console.log(id_usuario);
    /*utilizo la misma funcion ya que tomo el id usuario y el taxista*/
     /*la ubicacion del cliente*/
      this.servicio.get_ubicacion_taxista(id_usuario,_token).subscribe(
            servicio => {
      /***************************************************************************/
              this.result=servicio;
               console.log("REGISTRO EXISTE servicio");
            /*  let items = servicio.json();*/
            console.log(servicio);
              console.log("guarda el result en latlng");
              this.servicio.set_lat_lng(this.result);
             
               let datos_2:any=this.servicio.get_lat_lng();
                console.log('lat');
                console.log(datos_2);
                this.lat_usuario=datos_2.json().lat;
                console.log(this.lat_usuario);
                console.log('lng');
                this.lng_usuario=datos_2.json().lng;
                console.log(this.lng_usuario);
                 /*tomo el destino final*/
    let lat_lng_i=this.datos_taxista.lat_lng_f.split(',');
    this.lat_tax=lat_lng_i['0'];
    this.lng_tax=lat_lng_i['1'];
     /*************************************************/
    let lat_usuario:any=parseFloat(this.lat_usuario);
    let lng_usuario:any=parseFloat(this.lng_usuario);
    let lat_taxi:any=parseFloat(this.lat_tax);
    let lng_taxi:any=parseFloat(this.lng_tax);
    let inicio=new GoogleMapsLatLng(lat_usuario, lng_usuario);
    let fin=new GoogleMapsLatLng(lat_taxi, lng_taxi);
    let panel = document.getElementById('panel'); 
    var icono_pasajero ="assets/img/cliente_pin.png";
    let icono_taxi = "assets/img/bandera_meta.png";
    let directionsDisplay = null;
            directionsDisplay = this.render;
            /*el panel que tengo en el html OJO debe ir*/
     document.getElementById("panel").innerHTML = "";
     console.log('entro en panel');
      directionsDisplay.setMap(this.map);
      directionsDisplay.setOptions( { suppressMarkers: true } );
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
        this.makeMarker_1(leg.start_location,icono_pasajero, "algo 1" );
        this.makeMarker_2(leg.end_location, icono_taxi, 'algo 2' );
        if(this.distancia && this.temporal==0) {
         clearInterval(this.intervalo); 
         this.temporal=1;
         this.calcular_ruta_tiempo_destino();
        }
          /* directionsDisplay.setMap(this.map);*/
        }else{
          console.log('no va pal baile'+status);
        } 
      }, err => {console.log(err);
        alert(err);
            },)
      /****************************************************************************/
            },
            err => {console.log("NO EXISTE REGISTRO");
            console.log(err);  
            },
        );
  }
  makeMarker_1( position, icon, title ) {
    if(this.marker.m1) {
       this.marker.m1.setMap(null);
      this.marker.m1=new google.maps.Marker({
      position: position,
      map: this.map,
      icon: icon,
      title: title
     });
    }else{
     this.marker.m1=new google.maps.Marker({
      position: position,
      map: this.map,
      icon: icon,
      title: title
     });
    }
}
makeMarker_2( position, icon, title ) {
    if(this.marker.m2) {
       this.marker.m2.setMap(null);
       this.marker.m2=new google.maps.Marker({
      position: position,
      map: this.map,
      icon: icon,
      title: title
     });
    }else{
     this.marker.m2=new google.maps.Marker({
      position: position,
      map: this.map,
      icon: icon,
      title: title
     });
    }
}
/*aqui lo que hace es que cuando toma la ruta para el intervalo viejo y le da mas tiempo para que se mueva el carro*/
calcular_ruta_tiempo(){
 /* this.initializeMap_2();*/
  this.intervalo=setInterval(()=>{
    console.log('entro en calcular ruta tiempo');
   this.calcular_ruta();
  },20000);
}
calcular_ruta_tiempo_destino(){
  this.intervalo=setInterval(()=>{
    console.log('entro en calcular ruta tiempo destino');
   this.calcular_ruta_destino();
  },30000);
}
 estado_servicio(){
   let data:any=this.login.getMyGlobalVar();
   let data_2:any=this.servicio.get_id_servicio();
   let id_servicio=data_2;
   let id_usuario=data.json().id_usuario;
   let _token:any='5oJn^ixsIp~ltoEnXia^Iv[wIhiy]R0TkH6G';
   console.log('para el estado de servicio');
   clearInterval(this.intevalo_estado_servicio);
    this.servicio.get_servicio_abierto_id_usuario(id_usuario,id_servicio,_token).subscribe(
       prservicio => {
         this.result_2=prservicio;
          let id_status_servicio;
          for(let value of this.result_2) {
           id_status_servicio=value.id_status_servicio;
          }
          if(id_status_servicio==6) {
            console.log('si es 6');
                /*si ya la carrera se realizó*/
              this.pagar_servicio();
             console.log('para el intervalo de estado de servicio y el de las rutas');
            clearInterval(this.intervalo);
            clearInterval(this.intevalo_estado_servicio);
           }else{
             console.log('si es otrossssssssssssssssss');
             if(id_status_servicio==4) {
               /*lo envia a esta funcion*/
               console.log('para el intervalo de estado de servicio');
                clearInterval(this.intevalo_estado_servicio);
                this.problema_servicio();
             }else{
               console.log('entra de nuevo en el bucle del intervalo porque no lo consiguió');
               this.estado_servicio_contador();
             }
           }
       },
       err => {console.log("NO EXISTE REGISTRO");
       },
   );
 }
  pagar_servicio(){
    clearInterval(this.intervalo);
    console.log('entra en pagar_servicio');
     this.nav.setRoot('PaymentMethodPage');
  }

  /* aqui el verifica el problema del servicio y lo saca al home*/
   problema_servicio(){
    clearInterval(this.intervalo);
    console.log('ocurre el problema del servicio');
     this.nav.setRoot('HomePage');
  }   
/*fin*/
}
