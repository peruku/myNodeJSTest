import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';


@Injectable()
export class UserService {

  constructor(private af: AngularFire) { }

  isLogedIn: boolean = false;
  userName: string = "UnKnown";
  /*
  this.af.auth.subscribe(auth => {
      if(auth) {
        this.isLogedIn = true;
        if(auth.auth.displayName) this.userName = this.name.auth.displayName;
          
        }});*/
  
  isLoggedIn() {
        return this.isLogedIn;
    }
  getUser() {
      return this.af.auth;
  }
  getUserCartInfo(uid) {
      return this.af.database.object(`/userInfo/${uid}/userCart`);
  }

}
