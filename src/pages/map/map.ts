import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EliteApi } from '../../providers/elite-api/elite-api';

declare var window :any;
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  public map: any ={};

  constructor(private eliteApi: EliteApi, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    let games = this.navParams.data;
    let tourneyData = this.eliteApi.getCurrentTourney();
    let location = tourneyData.locations[games.locationId];
    this.map = {
      lat : location.latitude,
      lng: location.longitude,
      zoom: 12,
      markerLabel: games.location
    };
    }
    gotToDirections(){
      window.location = `geo:${this.map.latitude},${this.map.longitude};u=35;`;
    }

}
