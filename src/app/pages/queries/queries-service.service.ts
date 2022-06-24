import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class QueriesService extends ApiService {


  async getQueriesList(){
    return this.get('queries/getQuerie', {});
  }

  public getQueriesListByID(id){ // NA
    return this.get('Queriess/getQueriesDataById/'+id, {});
  }

  public addNewQueries(body){ // NA
    return this.post('Queriess/addQueriesDetails', body);
  }

  public updateQueries(id,body){ 
    return this.post('queries/updateQuery/'+id, body);
  }


  public deleteQueries(objId){ // NA
    console.log(objId);
    return this.get('queries/deleteQueryById//'+objId,{});

  }

}
