import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class NgoServicesService extends ApiService {


  async getNGOList(){
    return this.get('ngo/getNgoDetails', {});
  }

  public getNGOListByID(id){
    return this.get('getNgoDataById/'+id, {});
  }

  public addNewNGO(body){
    return this.post('ngo/addNgoDetails', body);
  }

  public updateNGO(id,body){
    return this.post('ngo/updateNgoData/'+id, body);
  }


  public deleteNGO(objId){
    console.log(objId);
    return this.get('ngo/deleteNgoDataByID/'+objId,{});

  }

}
