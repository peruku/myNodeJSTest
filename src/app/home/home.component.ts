import { Component, OnInit } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { Observable } from 'rxjs'
import "rxjs/add/operator/map";
import "rxjs/add/operator/filter";
import * as firebase from 'firebase';
import { UserService } from '../user.service';
import { MycartService } from '../mycart.service';
import { AuthGuard } from '../auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  name: any;
  user: any;
  displayName: string = 'Anonymus';
  state: string = '';
  uid: string;
  cartList: Observable<any>;
  cartHomeList: Observable<any>;
  expCartHomeList: Observable<any>;
  myCart: FirebaseObjectObservable<any>;
  myCartCount: number = 0;
  totalPriceAtCart: number;
  isClicked: boolean = false;
  myCartList: Observable<any>;
  myUserInfo: Observable<any>;
  userCartList: Observable<any>;

  constructor(public af: AngularFire,private router: Router, private _userService: UserService, private _mycartService: MycartService) {

     console.log("userLoggedInInfo :"+this._userService.isLoggedIn());
    //userQuantity need to be added for each item in cartList
    this.cartList = af.database.list('cartList')
      .map(items => { return items.filter(item => (<any>item).enable === true); });
    //this.cartList.subscribe(val => console.log(val));
    this.af.auth.subscribe(auth => {
      if(auth) {
        this.name = auth;
        this.uid = auth.auth.uid;
        //console.log(auth);
        if(auth.auth.displayName){ 
          this.displayName = this.name.auth.displayName;
          console.log("email :"+auth.auth.email);
          console.log("photoURL :"+auth.auth.photoURL);
          //update userInfo
          this.af.database.object(`/userInfo/${auth.auth.uid}`).update({
                name: auth.auth.displayName,
                email: auth.auth.email
            });
        }
        //this.myCartList = this.af.database.list(`/userInfo/${auth.auth.uid}/userCart`);
       // this.myCartList.subscribe(value => console.log);
        this.myCartList = af.database.list(`/userInfo/${auth.auth.uid}/userCart`,{
           query: {
             orderByChild: 'status',
             equalTo: 1
           }
         });
         
         this.myCartList.subscribe(val =>{
            //console.log(val);
            //val.do(obj => {this.totalPrice += obj.quantity * obj.price;});
            //this.totalPrice = 10;
          });
        //console.log(this.myCartList);
        //this.expCartHomeList = 
        /*
         .map(items => { return items.filter(item =>{
          if((<any>item).status === 1){
              console.log("cart ID"+(<any>item).$key);
              let userCartKey = (<any>item).$key;
              let userCartItemQ = (<any>item).quantity;
              this.cartList = this.cartList.map(citems => { return citems.filter(citem => {
                console.log(citem);
                // Add userQuantity property here
                if((<any>citem).ID === userCartKey){
                   (<any>citem).push({userQuantity: userCartItemQ});
                }
                return citem;
              });});
 
          }
         } ); }); */
        
      }
      else {
        console.log("Anonymus User");
      }
    });

    this.myCartList = this.af.database.list(`/userInfo/${this.uid}/userCart`);//.subscribe(list => console.log(list));
    

  }

  addToCart(id, count){
    this.isClicked = !this.isClicked;
    console.log(this.isClicked);
    let cartObj = {
                status: 1,
                quantity: count,
                at: firebase.database.ServerValue.TIMESTAMP
            };
    if(this.name){
      this.af.database.object(`/userInfo/${this.name.auth.uid}/userCart/${id}`).update(cartObj).then(val =>{
          this.totalPriceAtCart = this._mycartService.getTotalCartPrice();
      });
    }
    else console.log("User not logged IN");
    
  }

  getUserQuantity(key): number{
    //is not user return zero
    if(this.user ){
      console.log(key);
      console.log(this.userCartList);
      return 1;
    } 
    else return 0;
  }
  
  clickShipid(id,name,price, count){
    console.log("id : "+id+" price : "+price+" count : "+count);
    this.isClicked = !this.isClicked;
    console.log(this.isClicked);
    let cartObj = {
                status: 1,
                name: name,
                priceAtCart: price,
                quantity: count,
                at: firebase.database.ServerValue.TIMESTAMP
            };
    if(this.name){
      this.af.database.object(`/userInfo/${this.name.auth.uid}/userCart/${id}`).update(cartObj);
    }
    else console.log("User not logged IN");
    /*this.cartList.map(items => {return items.filter(item => (<any>item).ID == id)}).subscribe((firstItem) =>{
      console.log(firstItem[0].ID);
      if(this.name){
        this.myCart = this.af.database.object(`/userInfo/${this.name.auth.uid}/userCart/${firstItem[0].ID}`, {preserveSnapshot: true});
        this.myCart.subscribe(snapshot => {
          console.log(snapshot);
          if(snapshot.exists()){
            console.log("Already Added");
            
            console.log(snapshot.quantity);
            this.myCartCount = snapshot.quantity;
          }
          else{ 
            console.log("going to add");
            this.af.database.object(`/userInfo/${this.name.auth.uid}/userCart/${firstItem[0].ID}`).update({
                status: 1,
                priceAtCart: firstItem[0].price,
                quantity: 1,
                at: firebase.database.ServerValue.TIMESTAMP
            });
          }
        });
        if(this.myCartCount){
          console.log("count : "+this.myCartCount);
          this.af.database.object(`/userInfo/${this.name.auth.uid}/userCart/${firstItem[0].ID}`).update({
                status: 1,
                priceAtCart: firstItem[0].price,
                quantity: this.myCartCount+1,
                at: firebase.database.ServerValue.TIMESTAMP
            });
        }
        else{
          console.log("First Add");
           this.af.database.object(`/userInfo/${this.name.auth.uid}/userCart/${firstItem[0].ID}`).update({
                status: 1,
                priceAtCart: firstItem[0].price,
                quantity: 1,
                at: firebase.database.ServerValue.TIMESTAMP
            });
        }
      }
      else console.log("Error :Need to Login First !");
    }); */
  }

  logout() {
     this.af.auth.logout();
     console.log('logged out');
     //this.router.navigateByUrl('/login');
  }

  ngOnInit() {
    this._userService.getUser().subscribe(user =>{
       this.user = user;
       this.userCartList = this._userService.getUserCartInfo(user.auth.uid);
       this.cartHomeList = this._mycartService.getUserCartHomeList(user.auth.uid);
       this.cartHomeList.subscribe(list =>{
         this.totalPriceAtCart = this._mycartService.getTotalCartPrice();
       });
    });
    //this.cartHomeList = this._mycartService.getUserCartHomeList();
    //console.log(this.cartHomeList);
  }

}

