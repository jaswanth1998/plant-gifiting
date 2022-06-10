import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    private commonService: CommonService) { }

  public post(url, body, headers?){
    // this.spinner.show();
    setTimeout(() => {
      // this.spinner.hide();
    }, 5000 );
  //  api call

  }

  public loginPost(url, body, headers?) {
   console.log(url+body+headers)
  }
}
