import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { TeamHomePage } from '../team-home/team-home';
import { EliteApi } from '../../providers/elite-api/elite-api';
import * as _ from 'lodash';


@Component({
  selector: 'page-teams',
  templateUrl: 'teams.html',
})
export class TeamsPage {

  public teams = [];
  private allTeams: any;
  private allTeamDivisions: any;
  public queryText: string;
   

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private eliteApi : EliteApi,
  private loadingController : LoadingController) {
  }

  ionViewDidLoad() {
   let selectedTourney = this.navParams.data;
   let loader = this.loadingController.create({
    content: 'Getting data...'
  });
  loader.present().then(() => {
    this.eliteApi.getTournamentData(selectedTourney.id).subscribe(data => {
      this.allTeams = data.teams;
      this.allTeamDivisions =
          _.chain(data.teams)
          .groupBy('division')
          .toPairs()
          .map(item => _.zipObject(['divisionName', 'divisionTeams'], item))
          .value();

      this.teams = this.allTeamDivisions;
      console.log('division teams', this.teams); 
      loader.dismiss();
    });
  });

  
  }

  itemTapped($event,team){
    this.navCtrl.push(TeamHomePage,team);
  }
  updateTeams(){
    let qToLower = this.queryText.toLowerCase();
    let FilteredTeams = [];
    _.forEach(this.allTeamDivisions, td => {
      let teams = _.filter(td.divisionTeams,t=> (<any>t).name.toLowerCase().includes(qToLower));
      if(teams.length){
        FilteredTeams.push({divisionName:td.divisionName,divisionTeams:teams});
      }
    });
    this.teams = FilteredTeams;
  }
}
