import { Component, OnInit } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { Observable } from 'rxjs'
import "rxjs/add/operator/map";
import "rxjs/add/operator/filter";
import { MycartService } from '../mycart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  myCartList: Observable<any>;
  totalPrice: number = 0;
  authId: any;

  constructor(public af: AngularFire, private _mycartService: MycartService) {

    this.af.auth.subscribe(auth => {
      if(auth) {
        this.authId = auth.auth.uid;
        this.myCartList = af.database.list(`/userInfo/${this.authId}/userCart`)
         .map(items => { return items.filter(item =>{
          if((<any>item).status === 1){
            
            //this.totalPrice += (<any>item).quantity * (<any>item).priceAtCart;
            //console.log(this.totalPrice);
            item.info = this._mycartService.getCartItem(item.$key);
            console.log((<any>item).info.name + " - " +this.totalPrice);
            return item;
          }
         } ); });



         this.myCartList.subscribe(val =>{
            console.log(val);
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
  }

}
