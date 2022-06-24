import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService extends ApiService {


  async getOrdersList(){
    return this.get('orders/getOrderDetails/', {});
  }

  public getOrdersListByID(id){ //NA2
    return this.get('orders/getOrderDetailsById/'+id, {});
  }

  public addNewOrders(body){ //NA
    return this.post('orders/addOrdersDetails', body);
  }

  public updateOrders(id,body){ //NA
    return this.post('orders/updateOrdersData/'+id, body);
  }


  public deleteOrders(objId){ //NA
    console.log(objId);
    return this.get('orders/deleteOrdersDataByID/'+objId,{});

  }

}
