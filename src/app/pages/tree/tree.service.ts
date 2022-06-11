import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TreeService {

  constructor(private apiService : ApiService) { }

   public getTreeList(){
    return this.apiService.post('trees/getTreeDetails','na');
  }

  public getTreeListByID(id){
    return this.apiService.get('getTreesById/'+id, {});
  }

  public addNewTree(){

  }


  public deleteTree(objId){
    console.log(objId)
    this.apiService.post('bla bal','bla bla');

  }

}
