import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EventService extends ApiService {


  async getEventList(){
    return this.get('events/getEventDetails', {});
  }

  public getEventListByID(id){
    return this.get('events/getEventDataById/'+id, {});
  }

  public addNewEvent(body){
    return this.post('events/addEventDetails', body);
  }

  public updateEvent(id,body){
    return this.post('events/updateEventData/'+id, body);
  }


  public deleteEvent(objId){
    console.log(objId);
    return this.get('events/deleteEventDataByID/'+objId,{});

  }

}
