import { HttpClient, HttpClientModule } from '@angular/common/http';
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
  private API_ENDPOINT = `${
    this.appEnvironment.API_ENDPOINT
  }${'/api/'}`;

  constructor(
    private http: HttpClientModule,
    private commonService: CommonService,
    private message: NzMessageService) { }

  public post(url, body, headers?){
    // this.spinner.show();
    setTimeout(() => {
      // this.spinner.hide();
    }, 5000 );
  //  api call

  }

  successToast(msg = 'Operation success'){
    this.message.create('success', msg);
  }

  errorToast(msg = 'Operation failed'){
    this.message.create('error', msg);
  }

  public loginPost(url, body, headers?) {
   console.log(url+body+headers)
  }
}
