import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  appEnvironment = environment;
  private TOKEN_API_ENDPOINT = this.appEnvironment.API_ENDPOINT;
  private API_ENDPOINT = `${this.appEnvironment.API_ENDPOINT }${'/api/v1/'}`;

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private message: NzMessageService,
    ) { }

  public post(url, body, headers?){
    this.showProcessingToastOn();

  //  api call
    this.http.post(`${this.API_ENDPOINT}${url}`, {}).subscribe(
      (response : any) =>{
        console.log(response.success);
        if(response.success === true ){
          this.showProcessingToastOff();
          this.successToast();
          return(response);
        }
        else{
          this.showProcessingToastOff();
          this.errorToast();
        }
      },
      (error) =>{
        console.log(error);
        this.showProcessingToastOff();
        this.errorToast(error.message);
      }
    )

  }
  public get(url, body, headers?){
    this.showProcessingToastOn();
    setTimeout(() => {
       this.showProcessingToastOff();
       this.successToast();
    }, 2000 );
    
    this.http.get(`${this.API_ENDPOINT}${url}`, body).subscribe(
      (response : any) =>{
        console.log(response.success);
        if(response.success === true ){
          this.showProcessingToastOff();
          this.successToast();
          return(response);
        }
        else{
          this.showProcessingToastOff();
          this.errorToast();
        }
      },
      (error) =>{
        console.log(error);
        this.showProcessingToastOff();
        this.errorToast();
      }
    )

  }


  successToast(msg = 'Operation success'){
    this.message.create('success', msg);
  }

  errorToast(msg = 'Operation failed'){
    this.message.create('error', msg);
  }

  showProcessingToastOn(){
    this.message.loading('Action in progress..', { nzDuration: 0 }).messageId;
  }

  showProcessingToastOff(){
      this.message.remove();
  }

  public loginPost(url, body, headers?) {
   console.log(url+body+headers)
  }
}
