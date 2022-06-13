import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TreeService extends ApiService {


  async getTreeList(){
    return this.get('trees/getTreeDetails', {});
  }

  public getTreeListByID(id){
    return this.get('getTreesById/'+id, {});
  }

  public addNewTree(body){
    return this.post('trees/addTreeDetils', body);
  }

  public updateTree(id,body){
    return this.post('trees/updateTreeData/'+id, body);
  }


  public deleteTree(objId){
    console.log(objId);
    return this.get('trees/deleteTreesByID/'+objId,{});

  }

}
