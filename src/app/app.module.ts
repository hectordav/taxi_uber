import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
/*el modulo de firebase*/
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';

// import services
import {DriverService} from '../services/driver-service';
import {NotificationService} from '../services/notification-service';
import {PlaceService} from '../services/place-service';
import {TripService} from '../services/trip-service';
// end import services
/*providers*/
import {Prlogin} from "../providers/prlogin";
import {Prregistro} from "../providers/prregistro";
import {Prservicio} from "../providers/prservicio";
import {Prconductores} from "../providers/prconductores";
import { SplashScreen } from '@ionic-native/splash-screen';
/*el provider de facebook*/
import { Facebook } from 'ionic-native';
import { PrtipopagoProvider } from '../providers/prtipopago/prtipopago';
import {NativeGeocoder} from '@ionic-native/native-geocoder';
import { Network } from '@ionic-native/network';
import { PrconexionProvider } from '../providers/prconexion/prconexion';
import { PrnotificacionProvider } from '../providers/prnotificacion/prnotificacion';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { PrrutaProvider } from '../providers/prruta/prruta';
import { OneSignal } from '@ionic-native/onesignal';

@NgModule({
  declarations: [
    MyApp
],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,
     {
     scrollAssist: false, 
     autoFocusAssist: false
     })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
],
  providers: [
    Prlogin,
    DriverService,
    NotificationService,
    PlaceService,
    TripService,
    Facebook,
    Prregistro,
    Prservicio,
    Prconductores,
    Geolocation,
    SplashScreen,
    PrtipopagoProvider,
    Device,
    NativeGeocoder,
    Network,
    PrconexionProvider,
    PrnotificacionProvider,
    LaunchNavigator,
    PrrutaProvider,
    OneSignal

    /* import services */
]
})
export class AppModule {}
