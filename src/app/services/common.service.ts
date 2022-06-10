import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public userLoginStatus = false;
  
  constructor() { }

  setUserAsloggedIn(){
    this.userLoginStatus = true;
  }

  setUserAsLoggedOut(){
    this.userLoginStatus = false;

  }

}
