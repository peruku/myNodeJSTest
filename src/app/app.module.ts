import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { EmailComponent } from './email/email.component';
import { SignupComponent } from './signup/signup.component';
import { MembersComponent } from './members/members.component';
import { AuthGuard } from './auth.service';
import { routes } from './app.routes';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';

export const firebaseConfig = {
    apiKey: "AIzaSyDOvArG45o-OeCycvI4Au9LkOlzksJPo7A",
    authDomain: "dal2u-8098e.firebaseapp.com",
    databaseURL: "https://dal2u-8098e.firebaseio.com",
    storageBucket: "dal2u-8098e.appspot.com",
    messagingSenderId: "199650731030"
  };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmailComponent,
    SignupComponent,
    MembersComponent,
    CartComponent,
    HomeComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    routes
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
