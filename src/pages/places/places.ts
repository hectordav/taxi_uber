import { Component } from '@angular/core';
import { NavController,IonicPage } from 'ionic-angular';
import { PlaceService } from '../../services/place-service';

@IonicPage()
@Component({
  selector: 'page-places',
  templateUrl: 'places.html'
})
export class PlacesPage {
  // recent places
  public recentPlaces:any;

  // all places
  public places:any;

  constructor(public nav: NavController, public placeService: PlaceService) {
    this.recentPlaces = this.placeService.getAll();
    this.places = this.placeService.getAll();
  }

  choosePlace() {
    this.nav.pop();
  }
}
