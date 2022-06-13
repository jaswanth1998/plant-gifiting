import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public userLoginStatus = false;
  
  constructor(private message: NzMessageService) { }

  setUserAsloggedIn(){
    this.userLoginStatus = true;
  }

  setUserAsLoggedOut(){
    this.userLoginStatus = false;

  }

  
  public successToast(msg = 'Operation success'){
    this.message.create('success', msg);
  }

  public errorToast(msg = 'Operation failed'){
    this.message.create('error', msg);
  }

  public showProcessingToastOn(){
    this.message.loading('Action in progress..', { nzDuration: 0 }).messageId;
  }

  public showProcessingToastOff(){
      this.message.remove();
  }

}
