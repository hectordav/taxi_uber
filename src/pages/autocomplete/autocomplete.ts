import { Component } from '@angular/core';
import { NavController, NavParams,ViewController,IonicPage,Platform } from 'ionic-angular';
declare var google:any;
@IonicPage()
@Component({
  selector: 'page-autocomplete',
  templateUrl: 'autocomplete.html'
})
export class AutocompletePage {
	  autocompleteItems;
    autocomplete;
    backPressed:any=false;
    loader:any;
    service = new google.maps.places.AutocompleteService();
  constructor(public nav: NavController, public navParams: NavParams,public viewCtrl: ViewController,public platform:Platform) {
		this.autocompleteItems = [];
		this.autocomplete = {
		query: ''
		}
      /*****back button*****/
     platform.registerBackButtonAction(() => {
         if (this.nav.canGoBack()) {
          this.nav.pop()
          return;
        }
        if(!this.backPressed) {
          this.backPressed = true
          this.dismiss();
          setTimeout(() => this.backPressed = false, 2000)
          return;
        }else{
         this.platform.exitApp();
        }
      });
     /*/backbutton*/
  }
  dismiss() {
    this.viewCtrl.dismiss();
    }
  chooseItem(item: any) {
    this.viewCtrl.dismiss(item);
    }
   updateSearch() {
      console.log('modal > updateSearch');
        if (this.autocomplete.query == '') {
            this.autocompleteItems = [];
            return;
        }
        let self = this;
        let config = { 
          /*  types:  ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'*/
            input: this.autocomplete.query, 
            componentRestrictions: { country: 'MX' } 
        }
        this.service.getPlacePredictions(config, function (predictions, status) {
            console.log('modal > getPlacePredictions > status > ', status);
            self.autocompleteItems = [];
            predictions.forEach(function (prediction) {
               self.autocompleteItems.push(prediction);
            });
        });
  }

}
