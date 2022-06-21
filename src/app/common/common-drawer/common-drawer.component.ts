import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { TreeService } from 'src/app/pages/tree/tree.service';
import { EventService } from '../../pages/events/event-service.service';
@Component({
  selector: 'app-common-drawer',
  templateUrl: './common-drawer.component.html',
  styleUrls: ['./common-drawer.component.scss']
})
export class CommonDrawerComponent implements OnInit {
  
  @Input() value : any ;
  @Input() button = ''
  @Input() category = '';
  @Input() isNew = true;

  confirmModal?: NzModalRef; 
  
  TreeForm : FormGroup;
  NGOForm : FormGroup;
  EvetForm : FormGroup;
  EcardForm : FormGroup;

  isLive = false;
  oneImageUploadFlag = false;
  multipleImageUploadFlag = false;
  EventsList: any;
  TreesList : any;
  LocationsList : any;
  selectedEvent = "";

  NGO_projects : any[] = [];

  addNGOPrj(){

    let prj = {
      name : '',
      locations : []
    }

    this.NGO_projects.push(prj)

  }

  addNGOloc(prjindex){

    this.NGO_projects[prjindex]["locations"].push({
      location_name : "",
      trees : []
    })

  }

  addNGOloctree(prjindex,locindex){
    this.NGO_projects[prjindex]["locations"][locindex].trees.push({
      treeName : "",
      invenoory : "",
      cost : ""
    })
  }

  constructor(private drawerRef: NzDrawerRef<string>,
              private EventService : EventService,
              private TreeService : TreeService,
              private modal: NzModalService,
              private fb: FormBuilder) {}

 async ngOnInit(): Promise<void> {


  


    console.log(this.value, this.category ,this.button );

    if(this.category === 'tree'){

      this.TreeForm = new FormGroup({
        treeName : new FormControl(this.value.treeName, [
          Validators.required,
        ]),
        primaryTag : new FormControl(this.value.primaryTag, [
          Validators.required,
        ]),
        secondaryTag : new FormControl(this.value.primaryTag, []),
        icon : new FormControl(null, [
          // Validators.required,
        ]),
        images: new FormControl(null, [
          // Validators.required,
        ]),
        treeIntroduction : new FormControl(this.value.treeIntroduction, [
          Validators.required,
        ])
      });

      if( this.value.isLive === "false"){
        this.isLive = false;
      }
      else if( this.value.isLive === "true"){
        this.isLive = true;
      }
      else{
        this.isLive = false;
      }
    }

    if(this.category === 'NGO'){

      if(this.isNew === true){

        this.NGOForm = new FormGroup({
          ngoName : new FormControl(null, [
            Validators.required,
          ]),
          description : new FormControl(null, [
            Validators.required,
          ]),
          address : new FormControl(null, [
            Validators.required,
          ]),
          spocName : new FormControl(null, [
            Validators.required,
          ]),
          email: new FormControl(null, [
            Validators.required,
            Validators.email
          ]),
          phoneNumber : new FormControl(this.value.phoneNumber, [
            Validators.required, 
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
  
          ])
        });
  
      }else
      {
        this.NGOForm = new FormGroup({
          ngoName : new FormControl(this.value.ngoName, [
            Validators.required,
          ]),
          description : new FormControl(this.value.description, [
            Validators.required,
          ]),
          address : new FormControl(this.value.address, [
            Validators.required,
          ]),
          spocName : new FormControl(this.value.spocName, [
            Validators.required,
          ]),
          email: new FormControl(this.value.email, [
            Validators.required,
            Validators.email
          ]),
          phoneNumber : new FormControl(this.value.phoneNumber, [
            Validators.required, 
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
          ])
        });


        (await this.TreeService.getTreeList()).subscribe((response: any) =>{
          console.log(response);
          this.TreesList = response.data.filter((item)=>{
            if( item.isLive.toLowerCase() === 'yes' ||  item.isLive.toLowerCase() === 'true' ){
              return item;
            } 
          })
          console.log(this.TreesList);
      
          },
          (error)=>{
            console.log(error)
            // this.commonService.showProcessingToastOff();
          });

          

          (await this.TreeService.getlocatjionsList()).subscribe((response: any) =>{
            console.log(response);
            this.LocationsList = response.data;
            console.log(this.LocationsList);
        
            },
            (error)=>{
              console.log(error)
              // this.commonService.showProcessingToastOff();
            });
      

      }

      if( this.value.isLive === "false"){
        this.isLive = false;
      }
      else if( this.value.isLive === "true"){
        this.isLive = true;
      }
      else{
        this.isLive = false;
      }
    
    }

    if(this.category === 'event'){

      this.EvetForm = new FormGroup({
        eventName : new FormControl(this.value.eventName, [
          Validators.required,
        ]),
        eventImage : new FormControl(null, [
        //  
        ]),
      });

      if(this.isNew === true){
        this.isLive = false;
      }
      else{
        if( this.value.isLive.toLowerCase() === "no"){
          this.isLive = false;
        }
        else if( this.value.isLive.toLowerCase() === "yes"){
          this.isLive = true;
        }
        else{
          this.isLive = false;
        }
      }                 
    }

    if(this.category === 'ecard'){

      if(this.isNew === true){
        this.isLive = false;
        this.EcardForm = new FormGroup({
          ecardName : new FormControl(this.value.ecardName, [
            Validators.required,
          ]),
          html : new FormControl(this.value.html, [
            Validators.required,
          ])
        });
      }
      else{
      
        console.log(this.value)
        this.EcardForm = new FormGroup({
          ecardName : new FormControl(this.value.ecardName, [
            Validators.required,
          ]),
          html : new FormControl(this.value.html, [
            Validators.required,
          ]),
          openFor : new FormControl(this.value.openFor, [
            Validators.required,
          ])

        });
        
        if( this.value.isLive.toLowerCase() === "no"){
          this.isLive = false;
        }
        else if( this.value.isLive.toLowerCase() === "yes"){
          this.isLive = true;
        }
        else{
          this.isLive = false;
        }
        
        (await this.EventService.getEventList()).subscribe((response: any) =>{
          console.log(response);
          this.EventsList = response.data.filter((item)=>{
            if( item.isLive.toLowerCase() === 'yes' ){
              return item;
            } 
          })

          },
          (error)=>{
            console.log(error)
            // this.commonService.showProcessingToastOff();
          });
      
      

      }                 
    }

  }

 

  close(): void {
    this.drawerRef.close({});
  }
  treeSubmit(){
    if(this.TreeForm.valid){
      let formData = this.TreeForm.value;
      formData['isLive'] = this.isLive;
      formData['icon'] = 'https://floweraura-blog-img.s3.ap-south-1.amazonaws.com/Plants+Dec-19-Dec-20/foliage-plants-for-your-home-garden-cover-image.jpg';
      formData['images'] = ["https://www.ugaoo.com/knowledge-center/wp-content/uploads/2018/01/shutterstock_329291891-850x525.jpg",
                            "https://cdn.britannica.com/42/91642-050-332E5C66/Keukenhof-Gardens-Lisse-Netherlands.jpg",
                            "https://cdn.britannica.com/22/154422-050-94661645/Italian-Garden-Butchart-Gardens-Victoria-Vancouver-Island.jpg"
                          ];
      if(this.value){
        formData['_id'] = this.value['_id'];
      }                    
      console.log(formData);
      this.drawerRef.close(formData);
    }else{
      alert("invalid data not able to proceed");
    } 
  }

  NGOSubmit(){
    
    if(this.NGOForm.valid){

      console.log(this.NGOForm.value);
      let formData = this.NGOForm.value;
      if(this.value){
        formData['_id'] = this.value['_id'];
      }
      formData.projectDetails = this.NGO_projects;
      
      console.log(formData.projectDetails )

      // this.drawerRef.close(formData);
    }else{
      alert("invalid data not able to proceed");

    }


  }

  eventSubmit(){

    if(this.EvetForm.valid){
      console.log(this.EvetForm.value);
      let formData = this.EvetForm.value;

      if(this.isLive === true) {  formData['isLive'] = 'yes' }
      if(this.isLive === false) {  formData['isLive'] = 'no' }
      // need to update 
      formData['eventImage'] = 'https://img.freepik.com/free-vector/beautiful-flying-colorful-balloons-happy-birthday-watercolor-background_1035-20642.jpg?w=2000';

      if(this.value){
        formData['_id'] = this.value['_id'];
      }
      this.drawerRef.close(formData);
    }else{
      alert("invalid data not able to proceed");

    }
  }

  ecardSubmit(){

    if(this.EcardForm.valid){
      console.log(this.EcardForm.value);
      let formData = this.EcardForm.value;
      
      if(this.isLive === true) {  formData['isLive'] = 'yes' }
      if(this.isLive === false) {  formData['isLive'] = 'no' }

      if(this.value){
        formData['_id'] = this.value['_id'];
      }
      this.drawerRef.close(formData);
    }else{
      alert("invalid data not able to proceed");

    }
  }

  onImagesSelected(event:any){
    console.log(event.target.files);
    // alert()
  }

  uploadmultipleImages(){

  }

  onOneImageSelected(event:any){
    console.log(event.target.files);
    this.oneImageUploadFlag = true;
  }

  showreqError(form,field){
    const formfield = form.get(field);
    if (formfield.touched && !formfield.valid) {
      if (formfield.errors.required) {
        return 'Field is required';
      }
      if (formfield.errors.email) {
        return 'Invalid Emai';
      }

    }

  }

  showreqandemilError(form,field){
    const formfield = form.get(field);
    if (formfield.touched && !formfield.valid) {
      if (formfield.errors.required) {
        return 'Field is required';
      }
      if (formfield.errors.email) {
        return 'Invalid Emai';
      }
      // regex 
    }
  }

  showreqerrandPhoneerror(form,field){
    const formfield = form.get(field);
    if (formfield.touched && !formfield.valid) {
      if (formfield.errors.required) {
        return 'Field is required';
      }
      if (formfield.error.pattern) {
        return 'Invalid '+field + 'field';
      }
      // regex 
    }
  }


  deleteNGOloctree(prjindex,locindex,  treeindex){

    console.log(prjindex,locindex,  treeindex);
    console.log(this.NGO_projects);
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete tree ',
      nzOnOk: () => {
        console.log('delete the tree ')
        this.NGO_projects[prjindex]["locations"][locindex]["trees"].splice(treeindex,1);       
      }
        
    });

  }
  deleteNGOlocation(prjindex,locindex){

    console.log(prjindex,locindex);
    console.log(this.NGO_projects);

    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete Location ',
      nzOnOk: () => {
        console.log('delete the location ')
        this.NGO_projects[prjindex]["locations"].splice(locindex,1);       
      }
        
    });
 

  }
  deleteNGOprj(prjindex){
    console.log(prjindex);
    console.log(this.NGO_projects);

    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete Project ',
      nzOnOk: () => {
        console.log('delete the location ')
        this.NGO_projects.splice(prjindex,1);       
      }
        
    });
  }

}
