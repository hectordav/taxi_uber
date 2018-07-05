import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { PrrutaProvider } from '../providers/prruta/prruta';
/*
  Generated class for the Prservicio provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Prservicio {
		principal_url:string;
		id_taxista:any;
		id_servicio:any;
		lat_lng:any;
		datos_taxista:any;
    datos_servicio:any;
    datos_monto_servicio:any;
    variable_cambio_tracking:any;
    variable_cancela_driver:any=0;
  constructor(public http: Http,public ruta:PrrutaProvider) {
    this.principal_url=this.ruta.get_ruta();
  }
  set_variable_cambio_tracking(value) {
    this.variable_cambio_tracking = value;
  }
  get_variable_cambio_tracking(){
   return this.variable_cambio_tracking;
  }
  set_variable_cancela_driver(value) {
    this.variable_cancela_driver = value;
  }
  get_variable_cancela_driver(){
   return this.variable_cancela_driver;
  }

  set_datos_monto(value) {
    this.datos_monto_servicio = value;
  }
  get_datos_monto(){
   return this.datos_monto_servicio;
  }
  /*recibo (seteo) la variable global*/
  set_id_taxista(value) {
    this.id_taxista = value;
  }
  set_id_servicio(value) {
    this.id_servicio = value;
  }
  set_datos_taxista_global(value){
    this.datos_taxista=value;
  }
  set_datos_servicio_global(value){
    this.datos_servicio=value;
  }
  get_datos_taxista_global(){
   return this.datos_taxista;
  }
  get_datos_servicio_global(){
   return this.datos_servicio;
  }
  /*obtengo la variable global para enviarla a los controlers*/
  get_id_taxista() {
    return this.id_taxista;
  }
  get_id_servicio() {
    return this.id_servicio;
  }
  set_lat_lng(value){
     this.lat_lng = value;  
  }
  get_lat_lng() {
    return this.lat_lng;
  }
  get_ubicacion_taxista(_id_usuario_taxista,_token){
    var variable= JSON.stringify({id_usuario:_id_usuario_taxista,token:_token});
    var url = this.principal_url+'/servicio/ubicacion_taxista';
   /*no debe tener json porque sino dara error ya que no lo estoy enviando a la vista ojo*/
    var response = this.http.post(url, variable);
    return response;
  }
   get_ultima_ubicacion_taxista_hoy(_token){
    var variable= JSON.stringify({id_usuario:'1',token:_token});
    var url = this.principal_url+'/servicio/ultima_ubicacion';
   /*no debe tener json porque sino dara error ya que no lo estoy enviando a la vista ojo*/
    var response = this.http.post(url, variable).map(res => res.json());
    return response;
  }
   solicitar_servicio(_inicio,_fin,_lat_lng_i,_lat_lng_f,_notas,_id_usuario,_id_tipo_servicio,_id_status_servicio,_token,monto_aprox){
    var variable=JSON.stringify({desde:_inicio,hacia:_fin,lat_lng_i:_lat_lng_i, lat_lng_f:_lat_lng_f, observacion_cliente:_notas,id_usuario_contrata:_id_usuario,id_tipo_servicio:_id_tipo_servicio,id_status_servicio:_id_status_servicio,token:_token,monto_aprox:monto_aprox});
    var url = this.principal_url+'/servicio/solicitar_servicio';
    var response = this.http.post(url, variable).map(res => res.json());
    return response;
  }
  eliminar_servicio(id_servicio){
      var variable_2=JSON.stringify({id_servicio:id_servicio});
      var url = this.principal_url+'/servicio/eliminar_servicio';
      /*si quiero obtener el valor debo agregar el .map(res => res.json())*/
      var response = this.http.post(url,variable_2);
      return response;
    }
  push_cancelar_carrera(id_usuario_conductor){
      var variable_2=JSON.stringify({id_usuario_conductor:id_usuario_conductor});
      var url = this.principal_url+'/push_conductor/push_cancelar_carrera';
      /*si quiero obtener el valor debo agregar el .map(res => res.json())*/
      var response = this.http.post(url,variable_2);
      return response;
    }
  cancelar_solicitud_taxi(_id_usuario,_observacion_cliente,_token){
    var variable=JSON.stringify({id_usuario:_id_usuario,observacion_cliente:_observacion_cliente, token:_token});
    var url = this.principal_url+'/servicio/cancelar_solicitud_taxi_cliente';
    var response = this.http.post(url, variable);
    return response;
  }
  cancelar_solicitud_taxi_id_servicio(_id_servicio,_observacion_cliente,_token){
    var variable=JSON.stringify({id_servicio:_id_servicio,observacion_cliente:_observacion_cliente, token:_token});
    var url = this.principal_url+'/servicio/cancelar_solicitud_taxi_id_servicio';
    var response = this.http.post(url, variable);
    return response;
  }
  get_solicitud_aceptada(_id_usuario,_token){
    var variable=JSON.stringify({id_usuario:_id_usuario, token:_token});
    var url = this.principal_url+'/servicio/get_solicitud_aceptada';
    var response = this.http.post(url, variable).map(res => res.json());
    return response;
  }
  get_datos_taxista_id_cliente_id_servicio(_id_servicio,_token){
    var variable=JSON.stringify({id_servicio:_id_servicio, token:_token});
    var url = this.principal_url+'/servicio/get_datos_taxista_id_cliente_id_servicio';
    var response = this.http.post(url, variable).map(res => res.json());
    return response;
  }
  envio_email(_id_servicio,_token){
    var variable= JSON.stringify({id_servicio:_id_servicio, token:_token});
    var url = this.principal_url+'/servicio/envio_email';
    var response = this.http.post(url, variable);
    return response;
  }
  get_servicio_abierto_id_usuario(_id_usuario,_id_servicio,_token){
    var variable=JSON.stringify({id_usuario:_id_usuario, id_servicio:_id_servicio, token:_token});
    var url = this.principal_url+'/servicio/get_servicio_abierto_id_usuario';
    var response = this.http.post(url, variable).map(res => res.json());
    return response;
  }
    get_servicio_abierto_id_usuario_monto(_id_servicio,_token){
    var variable=JSON.stringify({id_servicio:_id_servicio, token:_token});
    var url = this.principal_url+'/servicio/get_servicio_abierto_id_usuario_monto';
    var response = this.http.post(url, variable).map(res => res.json());
    return response;   
  }
   get_puntaje_driver(_id_usuario_contrata,_token){
   var variable= JSON.stringify({id_usuario_contrata:_id_usuario_contrata, token:_token});
   var url = this.principal_url+'/puntaje_comentarios/get_puntaje_driver';
   var response = this.http.post(url, variable).map(res => res.json());
    return response; 
  }
  get_comentarios(_id_usuario_contrata,_token){
   var variable= JSON.stringify({id_usuario_contrata:_id_usuario_contrata, token:_token});
   var url = this.principal_url+'/puntaje_comentarios/get_comentarios';
   var response = this.http.post(url, variable).map(res => res.json());
    return response; 
  }
  calificar_usuario(_rating,_comentario,_id_taxista){
    var variable= JSON.stringify({rating:_rating,comentario:_comentario,id_taxista:_id_taxista});
    var url = this.principal_url+'/servicio/calificar_usuario';
    var response = this.http.post(url, variable);
    return response;
  }
  get_tarifa(){
    var variable= JSON.stringify({tarifa:1});
    var url = this.principal_url+'/tarifa/get_tarifa';
    var response = this.http.post(url, variable);
    return response;
  }
  get_banderazo(){
    var variable= JSON.stringify({tarifa:1});
    var url = this.principal_url+'/tarifa/get_banderazo';
    var response = this.http.post(url, variable).map(res => res.json());
    return response;
  }
  get_precio_minuto(){
    var variable=JSON.stringify({tarifa:1});
    var url = this.principal_url+'/tarifa/get_precio_minuto';
    var response = this.http.post(url, variable).map(res => res.json());
    return response;   
  }

}
