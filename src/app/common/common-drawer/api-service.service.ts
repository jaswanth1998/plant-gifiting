import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService extends ApiService {
  uploadPic(formData) {
    return this.post('images/upload', formData);
  }

  uploadPDF(formData) {
    return this.post('images/upload', formData);
  }

  sendQueriesNewMsg(id, obj) {
    return this.post('queries/updateQuery/' + id, obj);
  }
  sendEmail(obj){
    return (obj)
    return this.post('sms/sendEmail',obj)
  }
}
