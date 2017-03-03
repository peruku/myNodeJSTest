import { Component, OnInit } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { Observable } from 'rxjs'
import "rxjs/add/operator/map";
import "rxjs/add/operator/scan";
import "rxjs/add/operator/filter";
import { MycartService } from '../mycart.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  myCartList: Observable<any>;
  userCartList: Observable<any>;
  cartHomeList: Observable<any>;
  totalPrice: number = 0;
  totalPriceAtCart: number;
  authId: any;
  expTotal: Observable<any>;
  exp2Total: Observable<any>;

  constructor(public af: AngularFire, private _mycartService: MycartService, private _userService: UserService) {

    this.af.auth.subscribe(auth => {
      if(auth) {
        this.authId = auth.auth.uid;
        this.myCartList = af.database.list(`/userInfo/${this.authId}/userCart`,{
                 query: {
                   orderByChild: 'status',
                   equalTo: 1
                 }
            });
/*
         .map(items => { return items.filter(item =>{
          if((<any>item).status === 1){
            
            //this.totalPrice += (<any>item).quantity * (<any>item).priceAtCart;
            //console.log(this.totalPrice);
            item.info = this._mycartService.getCartItem(item.$key);
            console.log((<any>item).info.name + " - " +this.totalPrice);
            return item;
          }
         } ); });  */



         this.myCartList.subscribe(val =>{
           // console.log(val);

            //val.do(obj => {this.totalPrice += obj.quantity * obj.price;});
            //this.totalPrice = 10;
          });
        
      }
    });

   }

   removeFromCart (id, priceAtCart, quantity){
      this.af.database.object(`/userInfo/${this.authId}/userCart/${id}`).remove().then(_ => {
        console.log('deleted!');
        console.log('price Before'+this.totalPrice);
        this.totalPrice -= (priceAtCart * quantity );
        console.log('after!'+this.totalPrice);
      });
   }

  ngOnInit() {
    this._userService.getUser().subscribe(user =>{
       //this.user = user;
       //this.userCartList = this._userService.getUserCartInfo(user.auth.uid);
       if(user){
          console.log("UID "+user.auth.uid);
           this._mycartService.getUserCartList(user.auth.uid).subscribe(list =>{
             this.userCartList = list;
             console.log(list);
           });
           this.cartHomeList = this._mycartService.getUserCartHomeList(user.auth.uid);
           this.cartHomeList.subscribe(list =>{
             this.totalPriceAtCart = this._mycartService.getTotalCartPrice();
           });
          // this.expTotal = this._mycartService.getUserCartList(user.auth.uid).scan((acc,val) => {
            //   acc += val.quantity;
              // return acc;
           //  });
           //this.expTotal.subscribe(snapshot => console.log);
           
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
       
    });
  }

}
