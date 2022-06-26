import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  username: any;
  usetType: any;
 

  constructor(private router: Router) { }

  ngOnInit(): void {
   const userdata =  localStorage.getItem('user');
   console.log(userdata);
   const userdataobj = JSON.parse(userdata);
   if(userdata){
      this.username = userdataobj["name"];
     this.usetType = userdataobj["usetType"];
   }

  }

}
