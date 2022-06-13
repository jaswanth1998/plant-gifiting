import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-common-drawer',
  templateUrl: './common-drawer.component.html',
  styleUrls: ['./common-drawer.component.scss']
})
export class CommonDrawerComponent implements OnInit {
  
  @Input() value : any ;
  @Input() button = ''
  @Input() category = '';

  TreeForm : FormGroup;

  isLive = false;

  oneImageUploadFlag = false;
  multipleImageUploadFlag = false;
  form: string;
  constructor(private drawerRef: NzDrawerRef<string>) {}

  ngOnInit(): void {

    console.log(this.value, this.category ,this.button );

    if(this.category === 'tree'){

     this.form = 'tree';
     

      this.TreeForm = new FormGroup({
        treeName : new FormControl(this.value.treeName, [
          Validators.required,
        ]),
        primaryTag : new FormControl(this.value.primaryTag, [
          Validators.required,
        ]),
        secondaryTag : new FormControl(this.value.primaryTag, [
          Validators.required,
        ]),
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
  }

  close(): void {
    this.drawerRef.close({});
  }
  treeSubmit(){
   
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

}
