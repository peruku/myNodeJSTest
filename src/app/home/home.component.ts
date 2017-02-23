import { Component, OnInit } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { Observable } from 'rxjs'
import "rxjs/add/operator/map";
import "rxjs/add/operator/filter";

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

  constructor(public af: AngularFire,private router: Router) {

    this.af.auth.subscribe(auth => {
      if(auth) {
        this.name = auth;
        if(auth.auth.displayName) this.displayName = this.name.auth.displayName;
      }
    });

    this.cartList = af.database.list('cartList')
      .map(items => { return items.filter(item => (<any>item).enable === true); });
    this.cartList.subscribe(val => console.log(val));

  }

  logout() {
     this.af.auth.logout();
     console.log('logged out');
     //this.router.navigateByUrl('/login');
  }

  ngOnInit() {
  }

}

