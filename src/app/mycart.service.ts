import { Injectable, Inject } from '@angular/core';
import { AngularFire, FirebaseRef, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs'
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/do";
import "rxjs/add/operator/filter";
import * as firebase from 'firebase';


@Injectable()
export class MycartService {
  totalCartPrice: number = 0;
  constructor(private af: AngularFire, @Inject(FirebaseRef) fb) { }
  getTotalCartPrice() {
     return this.totalCartPrice;
  }
  getCartItem(key): Object {
    return this.af.database.object(`cartList/${key}`);
  }

  getUserCartList(uid): Observable<any> {
    return this.af.database.list(`/userInfo/${uid}/userCart`,{
                 query: {
                   orderByChild: 'status',
                   equalTo: 1
                 }
            })
            .map(items => {
               // console.log("userCart - items -item "+items);
                return items.map(item => {
                  //console.log("userCart - items -item "+item);
                  this.af.database.object(`/cartList/${item.$key}`).subscribe(value =>{
                    console.log("getUserCartList - cartList -item value "+value);
                    item.info = value;
                    console.log("getUserCartList - cartList -item  "+item.info.name);
                  });
                      return item;
                });
              });
  }
  getCartHomeList(): Observable<any> {
      return this.af.database.list('cartList',{
                 query: {
                   orderByChild: 'enable',
                   equalTo: true
                 }
            });
  } 
  getUserCartHomeList(uid): Observable<any> {
    //return this.af.database.list('cartList').map(items => { return items.filter(item => (<any>item).enable === true); });
    //const cartHlist$ = this.af.database.list('cartList')
    // .map(items => { 
    //                  return items.filter(item => (<any>item).enable === true); 
    //                });
    
    /*const cartHlist$ = this.af.database.list('cartList',{
         query: {
           orderByChild: 'enable',
           equalTo: true
         }BkX28mkCpTfO1sNmYFahS61TTeY2
    });
    return cartHlist$; */
    //.map(citems => {})
    /*
    return this.af.database.list('cartList',{
                 query: {
                   orderByChild: 'enable',
                   equalTo: true
                 }
            })
            .switchMap(items => {
              return Observable.from(items)
                       .mergeMap(item => {
                         return this.af.database.object(`/userInfo/{uid}/userCart/{item.$key}`)
                             .map(userCart =>{
                                 item.userCartQuantity = userCart.quantity;
                                 return item;
                             })
                       })
            }); */

            this.totalCartPrice = 0;

      return this.af.database.list('cartList',{
                 query: {
                   orderByChild: 'enable',
                   equalTo: true
                 }
            })
            .map(items => {
                return items.map(item => {
                  if(uid !== null){
                   // console.log("uid: "+uid+" key "+item.$key);
                    this.af.database.object(`/userInfo/${uid}/userCart/${item.$key}`)
                    //.take(1)
                    //.do(console.log)
                    .subscribe(value =>{
                        //console.log("1 Bef: "+item.userCartQuantity+" Aft: "+value.quantity);
                       // console.log("Bef "+this.totalCartPrice+"snapshot "+value.$key);
                        if(value.quantity != undefined){
                          item.userCartQuantity = value.quantity;
                          this.totalCartPrice += item.price * value.quantity;
                        }
                       // console.log("Aft "+this.totalCartPrice);
                        //console.log("2 Bef: "+item.userCartQuantity+" Aft: "+value.quantity);
                      });
                    
                    
                    
                  }
                  return item;
                });
            });


  }

}
