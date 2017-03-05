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
import { MdlDirective } from '../mdl.directive';



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
  exp2Total: Observable<any>;


  constructor(public af: AngularFire,
              private router: Router,
              private _userService: UserService,
              private _mycartService: MycartService) {
  
  }

  addToCart(id,name,price, count){
    let cartObj = {
                status: 1,
                name: name,
                priceAtCart: price,
                quantity: count,
                at: firebase.database.ServerValue.TIMESTAMP
            };
    if(this.name){
      if(1){//count){
        console.log("Adding"+name+" to Cart "+count+" itemS");
        this.af.database.object(`/userInfo/${this.name.auth.uid}/userCart/${id}`).update(cartObj).then(val =>{
            this.totalPriceAtCart = 0;
            this.totalPriceAtCart = this._mycartService.getTotalCartPrice();
        });
      }
      else{
        console.log("Removing"+name+" from Cart "+count+" itemS");
          this.af.database.object(`/userInfo/${this.name.auth.uid}/userCart/${id}`).remove().then(val =>{
              this.totalPriceAtCart = 0;
              //set itemCartHome userQuantity to zeo
              this.totalPriceAtCart = this._mycartService.getTotalCartPrice();
          });
      } 
    }
    else{
      console.log("User not logged IN");
      /* now getting 
      error_handler.js:54 EXCEPTION: Uncaught (in promise): TypeError: Illegal invocation
TypeError: Illegal invocation

      this.af.auth.login({
        method: AuthMethods.Anonymous,
        provider: AuthProviders.Anonymous
      }).then(
          (success) => {
          console.log(success);
        }).catch(
          (err) => {
          console.log(err);
        });
        */
    } 
    
  }
  
  logout() {
     this.af.auth.logout();
     console.log('logged out');
     this.displayName = 'Anonymus';
     //this.router.navigateByUrl('/login');
  }

  ngOnInit() {
    this._userService.getUser().subscribe(user =>{
      if(user){
        console.log("User Now Logged IN");
               this.name = user;
               this.uid = user.auth.uid;
                //console.log(auth);
                if(user.auth.displayName){ 
                  this.displayName = this.name.auth.displayName;
                  console.log("email :"+user.auth.email);
                  console.log("photoURL :"+user.auth.photoURL);
                  //update userInfo
                  this.af.database.object(`/userInfo/${user.auth.uid}`).update({
                        name: user.auth.displayName,
                        email: user.auth.email
                    });
                }
               this.userCartList = this._userService.getUserCartInfo(user.auth.uid);
               this.cartHomeList = this._mycartService.getUserCartHomeList(user.auth.uid);
               this.cartHomeList.subscribe(list =>{
                  //console.log(list);
                 this.totalPriceAtCart = this._mycartService.getTotalCartPrice();
               });

               this.exp2Total = this._mycartService.getUserCartList(user.auth.uid)
             .map(items => {
               let total = 0;
               items.map(item => {
                 //console.log(item);
                 total += item.quantity * item.priceAtCart;
                 //console.log("Full"+total);
               })
               return total;
              });
             
           this.exp2Total.subscribe(console.log);

      }
      else {
        console.log("User Not Signed IN");
        this.cartHomeList = this._mycartService.getUserCartHomeList(null);
        this.cartHomeList.subscribe(list =>{
                  //console.log(list);
                 this.totalPriceAtCart = this._mycartService.getTotalCartPrice();
               });
      }

    });
  }

}

