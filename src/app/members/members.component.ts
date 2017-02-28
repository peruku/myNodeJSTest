import { Component, OnInit } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { moveIn, fallIn, moveInLeft } from '../router.animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
  animations: [moveIn(), fallIn(), moveInLeft()],
  host: {'[@moveIn]': ''}
})
export class MembersComponent implements OnInit {

  name: any;
  state: string = '';
  userInfo: FirebaseObjectObservable<any>;
  //userData: Observable<any>;
  updateForm : FormGroup;
  user: any;
  /*interface Address {
    mobile: number;
    city: string;
    houseAddres: string;
    residComp: string;
    area: string;
    pincode: number;
    streetD: string;
    landM: string;
  }*/
  

  constructor(public af: AngularFire,fb: FormBuilder,private router: Router) { 

    this.updateForm = fb.group({
      // To add a validator, we must first convert the string value into an array.
      // The first item in the array is the default value if any,
      // then the next item in the array is the validator.
      // Here we are adding a required validator meaning that the firstName attribute must have a value in it.
      'mobile' : ['', Validators.required],
      // We can use more than one validator per field.
      // If we want to use more than one validator we have to wrap our array of validators with a Validators.
      //compose function. Here we are using a required, minimum length and maximum length validator.
      //'lastName': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
      'city' : [null, Validators.required],
      'houseAddress' : [null, Validators.required],
      'residComp'  : "",
      'area' : [null, Validators.required],
      'pincode' : [null, Validators.required],
      'streetD' : "",
      'landM' : ""
    })

    this.af.auth.subscribe(auth => {
      if(auth) {
        this.name = auth;
        //console.log("email :"+this.name.auth.email);
        //console.log("UID :"+this.name.auth.uid);
        this.userInfo = this.af.database.object(`/userInfo/${this.name.auth.uid}`);
        //this.userInfo.subscribe(console.log);
        this.userInfo.subscribe(user => {
              //console.log("in subscribe "+user.mobile);
              this.user = user;
              //this.updateForm.controls['mobile'] = user.mobile;
              //this.updateForm.find('mobile').updateValue(user.mobile);
              //this.updateForm.setValues({username: this.user.username, mail: this.user.mail})
        });

      }
    });
    //console.log("Outside "+this.user);
    
    //this.userData = af.database.object(`/userInfo/${this.name.auth.uid}`);
    //this.userData.subscribe(d => {this.userData = d}); // add this line!
    this.user = {
      mobile: '',
      city: '',
      houseAddres: '',
      residComp: '',
      area: '',
      pincode: '',
      streetD: '',
      landM: ''    
    };

  }

  logout() {
     this.af.auth.logout();
     //console.log('logged out');
     this.router.navigateByUrl('/login');
  }

  submitForm(value: any):void{
    //console.log('Reactive Form Data: ')
    //console.log("FormBuilder ->"+value);
    //console.log("ngModel ->"+this.user);
    this.af.database.object(`/userInfo/${this.name.auth.uid}`).update(value).then(_ => this.router.navigateByUrl('/home'));
  }

  ngOnInit() {
  }

}
