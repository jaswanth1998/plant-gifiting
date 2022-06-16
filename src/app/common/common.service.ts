import { Injectable } from '@angular/core';
import { EventService } from '../pages/events/event-service.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService  {

  eventsList : any;

  constructor( private EventService : EventService ){

    this.getEventsData();

    this.getEventNamesFromID(["62a49419c9a2c865d9bb8139","62a492bcc9a2c865d9bb8132"]);

  }


  async getEventsData(){
      (await this.EventService.getEventList()).subscribe((response: any) =>{
      console.log(response)
      this.eventsList = response.data.filter((item)=>{
        if( item.isLive.toLowerCase() === 'yes' ){
          return item;
        } 
      })
      console.log(this.eventsList);
      },
      (error)=>{
        console.log(error)
      });
  }

  public  getEventNamesFromID(idlist : string[]){

    let listOfNames = "";

    idlist.forEach( (id)=>{
      const index = this.eventsList.findIndex(evnt => evnt._id === id);
      listOfNames = listOfNames + ', ' + this.eventsList[index]['eventName'];
    });

    console.log(listOfNames);
    // const index = fruits.findIndex(fruit => fruit === "blueberries");
    return "jk";
  }

}
