import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { PrrutaProvider } from '../prruta/prruta';


@Injectable()
export class PrtipopagoProvider {
	principal_url:string;

  constructor(public http: Http,public ruta:PrrutaProvider) {
    console.log('Hello PrtipopagoProvider Provider');
    this.principal_url=this.ruta.get_ruta();
  }
   get_tipo_pago(tipopago,_token){
    var variable=JSON.stringify({tipopago:tipopago, token:_token});
    var url = this.principal_url+'/tipo_pago/get_tipo_pago';
    var response = this.http.post(url, variable).map(res => res.json());
    return response;   
  }
  get_tarifa(tarifa){
    var variable=JSON.stringify({tarifa:tarifa});
    var url = this.principal_url+'/tipo_pago/get_tarifa';
    var response = this.http.post(url, variable).map(res => res.json());
    return response;   
  }
  get_precio_minuto(){
    var variable=JSON.stringify({tarifa:1});
    var url = this.principal_url+'/tipo_pago/get_precio_minuto';
    var response = this.http.post(url, variable).map(res => res.json());
    return response;   
  }
  verificar_codigo_promo(_codigo,_monto,_id_usuario,_token){
  	var variable=JSON.stringify({codigo:_codigo,monto:_monto,id_usuario:_id_usuario,token:_token});
    var url = this.principal_url+'/tipo_pago/verificar_codigo_promo';
    var response = this.http.post(url, variable);
    return response;	
  }

}
