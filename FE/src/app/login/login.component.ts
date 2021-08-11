import { Employee } from 'src/app/__services__/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginData } from '../__services__/auth.service';
import { fadeSlideInOutAnimation } from './../__utils__/animations';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeSlideInOutAnimation],
})
export class LoginComponent implements OnInit {
  loginData: LoginData = {
    registration: '',
    passkey: '',
  };
  hidePwd = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (localStorage.getItem('accessToken')) {
      this.router.navigate(['dashboard']);
    }
  }

  openValidationSnackBar(msg: string) {
    this._snackBar.open(msg, 'OK', {
      duration: 8000,
      // horizontalPosition: 'start',
      // verticalPosition: 'bottom',
    });
  }

  handleLogin() {
    if (!this.loginData.registration || !this.loginData.passkey) {
      this.openValidationSnackBar('Tous les champs doivent être remplis.');
      return;
    }

    this.authService.login(this.loginData).subscribe(async (res) => {
      if (res.accessToken === 'NO_ACCESS_TOKEN') {
        this.openValidationSnackBar('Identifiants invalides.');
      } else {
        localStorage.setItem('accessToken', res.accessToken);
        this.router.navigate(['dashboard']);
      }
    });
  }
}
