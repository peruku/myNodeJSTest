import { Component, OnInit } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { Observable } from 'rxjs'
import "rxjs/add/operator/map";
import "rxjs/add/operator/filter";
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  name: any;
  displayName: string = 'Anonymus';
  state: string = '';
  cartList: Observable<any>;
  myCart: FirebaseObjectObservable<any>;
  myCartCount: number = 0;

  constructor(public af: AngularFire,private router: Router) {

    this.af.auth.subscribe(auth => {
      if(auth) {
        this.name = auth;
        if(auth.auth.displayName){ 
          this.displayName = this.name.auth.displayName;
          console.log("email :"+auth.auth.email);
          console.log("photoURL :"+auth.auth.photoURL);
          this.af.database.object(`/userInfo/${auth.auth.uid}`).update({
                name: auth.auth.displayName,
                email: auth.auth.email
            });
        }
      }
    });

    this.cartList = af.database.list('cartList')
      .map(items => { return items.filter(item => (<any>item).enable === true); });
    //this.cartList.subscribe(val => console.log(val));

  }

  clickShipid(id,name,price, count){
    console.log("id : "+id+" price : "+price+" count : "+count);
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
  }

}

