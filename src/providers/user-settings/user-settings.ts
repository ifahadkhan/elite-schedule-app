import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';
import { SqlStorage } from '../sql-storage/sql-storage';

const win :any =  Window;
@Injectable()
export class UserSettings {
  private sqlMode= false;

  constructor(private storage : Storage, private sql : SqlStorage) {
   if(win.sqlitePlugin){
     this.sqlMode = true;
   }else{
     console.log('SQLite pluging not installed. Falling back to regular ionic storage.');
   }
  }
  favoriteTeam(team,tournamentId,tournamentName){
    let item = {team:team,tournamentId:tournamentId,tournamentName:tournamentName};
    if(this.sqlMode)
    {
      this.sql.set(team.id.toString(),JSON.stringify(item));

    }else{
      this.storage.set(team.id.toString(),JSON.stringify(item));

    }
    
  }
  unfavoriteTeam(team){
    if(this.sqlMode)
    {
      this.sql.remove(team.id.toString());
    }
    else
    {
      this.storage.remove(team.id.toString());
    }
    
  }
  isFavoriteTeam(teamsId: string): Promise<boolean>{
    if(this.sqlMode)
    {
      this.sql.get(teamsId.toString()).then(values => values ? true:false);
    }
    else
    {
    return new Promise(resolve => resolve(this.storage.get(teamsId).then(value=>value ? true:false)) );
    }
  }
  getAllFavorites(): Promise<any>{
    // let result = [];
    // this.storage.forEach(data=>{
    //  // console.log('###inside foreach',data);
    //   result.push(JSON.parse(data));


    // });
    // return result;
    if(this.sqlMode){
      return this.sql.getAll();
    }else{
      return new Promise(resolve =>{
         let result = [];
        this.storage.forEach(data=>{
          console.log('###inside foreach',data);
          result.push(JSON.parse(data));
      });
      return resolve(result);
    });
  }
}
  initStorage(): Promise<any>{
    if(this.sqlMode){
      return this.sql.initializeDatabase();
    }else{
      return new Promise(resolve=> resolve());
    }

  }

}
