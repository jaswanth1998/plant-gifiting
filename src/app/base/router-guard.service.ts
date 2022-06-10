import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterGuardService  implements CanActivate  {

 
  constructor( private router: Router ) { }

  async canActivate(route: ActivatedRouteSnapshot ){
    
    console.log(route.routeConfig.path);  
    // this.router.navigate(['/launch']);
    return true;
  }
}
