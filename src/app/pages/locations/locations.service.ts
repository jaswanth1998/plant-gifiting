import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class locationservice extends ApiService {


  async getlocationsList(){
    return this.get('locations/getLocationDetails', {});
  }

  public getlocationsListByID(id){
    return this.get('locations/getLocationById'+id, {});
  }

  public addNewlocation(body){
    return this.post('locations/addLocationsDetails', body);
  }

  public updatelocation(id,body){
    return this.post('locations/updateLocation/'+id, body);
  }


  public deletelocation(objId){
    console.log(objId);
    return this.get('locations/deleteLocationByID/'+objId,{});

  }



}
