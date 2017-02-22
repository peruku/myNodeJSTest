import { Component, OnInit } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  name: any;
  displayName: string = 'Anonymus';
  state: string = '';

  constructor(public af: AngularFire,private router: Router) {

    this.af.auth.subscribe(auth => {
      if(auth) {
        this.name = auth;
        if(auth.auth.displayName) this.displayName = this.name.auth.displayName;
      }
    });

  }

  logout() {
     this.af.auth.logout();
     console.log('logged out');
     //this.router.navigateByUrl('/login');
  }

  ngOnInit() {
  }

}

