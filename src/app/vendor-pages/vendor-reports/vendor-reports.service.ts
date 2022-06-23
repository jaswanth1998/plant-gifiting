import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class VendorReportsService extends ApiService {


  // async getEcardList(){
  //   return this.get('ecards/getEcardDetails', {});
  // }

  // public getEcardListByID(id){
  //   return this.get('ecards/getEcardDataById'+id, {});
  // }

  // public addNewEcard(body){
  //   return this.post('ecards/addEcardDetails', body);
  // }

  // public updateEcard(id,body){
  //   return this.post('ecards/updateEcardData/'+id, body);
  // }


  // public deleteEcard(objId){
  //   console.log(objId);
  //   return this.get('ecards/deleteEcardDataByID/'+objId,{});

  // }

  // public getEventsList(){
  //   return this.get('events/getEventDetails', {});
  // }
  

}
