
import 'rxjs/add/operator/map';

export class PrrutaProvider {
	principal_url:string='http://mimandadero.com/taxi/taxi_rest_pedro';
  constructor() {
    console.log('Hello PrrutaProvider Provider');
  }

  get_ruta() {
    return this.principal_url;
  }


}
