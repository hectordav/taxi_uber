import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { PrrutaProvider } from '../providers/prruta/prruta';
/*
  Generated class for the Prregistro provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
  http://localhost/tax_si_rest
*/
@Injectable()
export class Prregistro {
	principal_url:string;
	variable_global: any; 


  constructor(public http: Http, public ruta:PrrutaProvider) {
    console.log('Hello Prregistro Provider');
    this.principal_url=this.ruta.get_ruta();
  }
    /*recibo (seteo) la variable global*/
  setMyGlobalVar(value) {
    this.variable_global = value;
  }
  /*obtengo la variable global para enviarla a los controlers*/
  getMyGlobalVar() {
    return this.variable_global;
  }
  get_usuario_login(email,_token){
    var variable=JSON.stringify({email:email,token:_token});
    var url = this.principal_url+'/login/get_usuario_login';
    var response = this.http.post(url, variable);
    return response;
  }
 guardar_usuario(_token,_cedula,_nombre,_direccion,_telf,_email,_genero,_fecha_nac,_password,_token_u,_serial){
    var variable=JSON.stringify({token:_token,cedula:_cedula,nombre:_nombre,direccion:_direccion,telf:_telf,email:_email,genero:_genero,fecha_nac:_fecha_nac,password:_password,token_u:_token_u, serial:_serial});
    var url = this.principal_url+'/registro/guardar_usuario';
    var response = this.http.post(url, variable).map(res => res.json());
    return response;
  }
  guardar_usuario_face(_token,_cedula,_nombre,_direccion,_telf,_email,_genero,_fecha_nac,_password,_token_u,_serial){
    var variable=JSON.stringify({token:_token,cedula:_cedula,nombre:_nombre,direccion:_direccion,telf:_telf,email:_email,genero:_genero,fecha_nac:_fecha_nac,password:_password,token_u:_token_u, serial:_serial});
    var url = this.principal_url+'/registro/guardar_usuario_facebook';
    var response = this.http.post(url, variable).map(res => res.json());
    return response;
  }
  cambiar_clave(_id_usuario,pass1){
    var variable=JSON.stringify({id_usuario:_id_usuario,password:pass1});
    var url = this.principal_url+'/registro/cambiar_clave';
    var response = this.http.post(url, variable);
    return response; 
  }

}
