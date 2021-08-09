import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { fadeSlideInOutAnimation } from './../__utils__/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeSlideInOutAnimation],
})
export class LoginComponent {
  identifier = '';
  password = '';
  hidePwd = true;

  constructor(private router: Router) {}

  handleLogin() {
    // alert(this.identifier + ' ' + this.password);

    // if (this.identifier && this.password) {
      this.router.navigate(['dashboard']);
    // }
  }
}
