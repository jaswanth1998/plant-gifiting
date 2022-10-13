import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService extends ApiService {


  async getOrdersList(){
    return this.get('orders/getOrderDetails/', {});
  }

  public getOrdersListByID(id){ //NA
    return this.get('orders/getOrderDetailsById/'+id, {});
  }

  public addNewOrders(body){ //NA
    return this.post('orders/addOrdersDetails', body);
  }

  public updateOrders(id,body){ 
    return this.post('orders/updateOrderData/'+id, body);
  }


  public deleteOrders(objId){ //NA
    console.log(objId);
    return this.get('orders/deleteOrdersDataByID/'+objId,{});
  }
  async sendEmail(obj){
    return this.post('sms/sendEmail', obj);

  }
}
