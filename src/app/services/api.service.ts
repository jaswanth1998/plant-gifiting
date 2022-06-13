import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';
import { CommonService } from './common.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  appEnvironment = environment;
  private TOKEN_API_ENDPOINT = this.appEnvironment.API_ENDPOINT;
  private API_ENDPOINT = `${this.appEnvironment.API_ENDPOINT }${'/api/v1/'}`;

  private extractData(res) {
    try {
      const body = res.json();
      return body || {};
    } catch (e) {
      return res;
    }
  }
  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private message: NzMessageService,
    ) { }


  public post(url, body, headers?){

  //  api call
  return this.http.post(`${this.API_ENDPOINT}${url}`, body).pipe(
    map(this.extractData),
    catchError(error => {
      return  'Error while executing POST for route '
    })
  );

  }
 async get (url, body, headers?) {
   
    return this.http.get(`${this.API_ENDPOINT}${url}`, body).pipe(
      map(this.extractData),
      catchError(error => {
        return  'Error while executing POST for route '
      })
    );

  }

  public loginPost(url, body, headers?) {
   console.log(url+body+headers)
  }
}
