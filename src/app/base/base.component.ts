import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  isCollapsed = true;
  username = "";
  usetType = "";

  constructor(private router: Router) { }

  ngOnInit(): void {
   const userdata =  localStorage.getItem('user');
   console.log(userdata);
   const userdataobj = JSON.parse(userdata);
   if(!userdata){
    this.router.navigateByUrl('/');
   }else{
    this.username = userdataobj['userData']['name'];
    this.usetType = userdataobj['userData']['usetType'];
   }

  }

  logout(){
    if (confirm( 'Do you want to logout...? ')){
      localStorage.clear();
      location.reload();
    }
    
  }
}
