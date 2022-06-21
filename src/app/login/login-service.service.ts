import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService  extends ApiService {
 
  async loginUser(userDetails){
    return this.post('users/signIn',userDetails)

  }
  
}
