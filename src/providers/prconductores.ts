import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { PrrutaProvider } from '../providers/prruta/prruta';


@Injectable()
export class Prconductores {
	principal_url:string;
  constructor(public http: Http,public ruta:PrrutaProvider) {
    this.principal_url=this.ruta.get_ruta();
  }
   conductores_disponibles(_token){
    var variable=JSON.stringify({id_usuario:1,token:_token});
    var url = this.principal_url+'/conductores/conductores_disponibles';
    var response = this.http.post(url, variable).map(res => res.json());
    return response;
  }
    get_distancia_taxi_cliente(){
    var variable=JSON.stringify({id_usuario:1});
    var url = this.principal_url+'/conductores/get_distancia_taxi_cliente';
    var response = this.http.post(url, variable);
    return response;
  }

}
