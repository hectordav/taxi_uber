import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { PrrutaProvider } from '../providers/prruta/prruta';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
/*
  Generated class for the Prlogin provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
  http://localhost/tax_si_rest/
*/

@Injectable()
export class Prlogin {
	principal_url:string;
	variable_global: any;
	variable_token: any;
  variable_serial: any;
	variable_face: any; 
  variable_status_conexion: any; 

  constructor(public http: Http, public ruta:PrrutaProvider) {
    this.principal_url=this.ruta.get_ruta();
    console.log(this.principal_url);
  }
  
  /*recibo (seteo) la variable global*/
  set_variable_status_conexion(value) {
    this.variable_status_conexion = value;
  }
  /*obtengo la variable global para enviarla a los controlers*/
  get_variable_status_conexion() {
    return this.variable_status_conexion;
  }
  /*recibo (seteo) la variable global*/
  setMyGlobalVar(value) {
    this.variable_global = value;
  }
  /*obtengo la variable global para enviarla a los controlers*/
  getMyGlobalVar() {
    return this.variable_global;
  }
  /*el serial*/
  set_serial(value) {
    this.variable_serial = value;
  }
  /*obtengo el serial*/
  get_serial() {
    return this.variable_serial;
  }
  /*el token del push*/
  setToken(value) {
    this.variable_token = value;
  }
  /*obtengo el push y lo comparo con el guardado */
  getToken() {
    return this.variable_token;
  }
  set_my_Global_Face(value_2){
    this.variable_face=value_2
  }
  get_my_Global_Face(){
     return  this.variable_face;
  }
  /*************************************************************************/
   login(user,pass,_token_u,_serial){
    var variable=JSON.stringify({user:user,pass:pass, token:_token_u,serial:_serial});
    var url = this.principal_url+'/login/login';
    var response = this.http.post(url, variable);
    return response;
  }
  buscar_usuario_face_token(_login,_clave,_token){
    var variable=JSON.stringify({login:_login,clave:_clave,token:_token});
    var url = this.principal_url+'/registro/buscar_usuario_face_token';
    var response = this.http.post(url, variable);
    return response;
  }
  buscar_usuario_manual_token(_login,_clave,_token,_token_u){
    var variable=JSON.stringify({login:_login,clave:_clave,token:_token,token_u:_token_u});
    var url = this.principal_url+'/registro/buscar_usuario_manual_token';
    var response = this.http.post(url, variable);
    return response;
  }
  buscar_usuario_manual_serial(_serial,_token,_token_u){
    var variable=JSON.stringify({serial:_serial,token:_token,token_u:_token_u});
    var url = this.principal_url+'/registro/buscar_usuario_manual_token';
    var response = this.http.post(url, variable).map(res => res.json());
    return response;
  }
  login_facebook(user,pass,_token_u){
    var variable=JSON.stringify({user:user,pass:pass,token:_token_u});
    var url = this.principal_url+'/login/login_facebook';
    var response = this.http.post(url, variable);
    return response;
  }
  login_serial(_serial,token){
    var variable=JSON.stringify({serial:_serial,token:token});
    var url = this.principal_url+'/login/login_serial';
    var response = this.http.post(url, variable);
    return response;
  }
  guardar_ubicacion(id_usuario,lat_lng,_token){
    var variable=JSON.stringify({id_usuario:id_usuario, lat_lng:lat_lng, token:_token});
    var url = this.principal_url+'/login/guardar_ubicacion';
    var response = this.http.post(url, variable);
    return response;   
  }
  /*************************************************************************/

}
