import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class EliteApi {
  private baseUrl = "https://elite-schedule-app-i2-30856.firebaseio.com/";
  private currentTourney: any= {};
  private tourneyData = {};


  constructor(public http: Http) { }
  getTournaments(){
    return new Promise(resolve=>{
      this.http.get(`${this.baseUrl}/tournaments.json`)
      .subscribe(res=>resolve(res.json()));
    });
  }
  getTournamentData(tourneyId, forceRefresh: boolean =false): Observable<any>{
    if(!forceRefresh && this.tourneyData[tourneyId]){
      this.currentTourney = this.tourneyData[tourneyId];
      console.log("no HTTP call...");
      return Observable.of(this.currentTourney);
    }
    
      console.log('**HTTP call');
          return this.http.get(`${this.baseUrl}/tournaments-data/${tourneyId}.json`)
    .map(response =>{
      this.tourneyData[tourneyId] = response.json();
      this.currentTourney = this.tourneyData[tourneyId];
      return  this.currentTourney;
    });
 
  }
  
  getCurrentTourney(){
    return this.currentTourney;
  }
  refreshCurrentTourney(){
    return this.getTournamentData(this.currentTourney.tournament.id,true);
  }

  }
