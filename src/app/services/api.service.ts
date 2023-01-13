import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';
import { CommonService } from './common.service';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  appEnvironment = environment;
  private TOKEN_API_ENDPOINT = this.appEnvironment.API_ENDPOINT;
  private API_ENDPOINT = `${this.appEnvironment.API_ENDPOINT }${'/csr/api/v1/'}`;

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
    private router:Router
    ) { }


  public post(url, body, headers?){
    this.checkExpiry()
    const token = localStorage.getItem('token')
    this.checkExpiry()
  //  api call

  return this.http.post(`${this.API_ENDPOINT}${url}`, body,{
    headers  :{"Authorization": 'Bearer '+token}

  }).pipe(
    map(this.extractData),
    catchError(error => {
      return  'Error while executing POST for route '
    })
  );

  }
 async get (url, body, headers?) {
  const token = localStorage.getItem('token')
  this.checkExpiry()
    return this.http.get(`${this.API_ENDPOINT}${url}`,{
      headers  :{"Authorization": 'Bearer '+token}
  
    }).pipe(
      map(this.extractData),
      catchError(error => {
        return  'Error while executing POST for route '
      })
    );

  }

  public loginPost(url, body, headers?) {
   console.log(url+body+headers)
  }
  checkExpiry() {
    const loginTime = localStorage.getItem('loginTime')
    if (loginTime) {
      const logedinTime = new Date(loginTime)
      const currentTime = new Date()
      var hours = Math.abs(logedinTime.getTime() - currentTime.getTime()) / 36e5;
      console.log(Math.round(hours))
      if (Math.round(hours) > 22) {
        this.logout()
      }
    }
  }
  logout() {

    

    localStorage.clear();

    

    this.router.navigate(['login']);
  }
}
