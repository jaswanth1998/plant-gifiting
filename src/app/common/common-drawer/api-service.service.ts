import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService extends ApiService {

  uploadPic(formData){
    return this.post('images/upload',formData)
  }
}
