import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { fadeSlideInOutAnimation } from './../__utils__/animations';
import axios, { AxiosResponse, AxiosError } from 'axios';
// import jwt_decode from 'jwt-decode';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../app.component';
import { baseUrl } from './../__utils__/baseUrl';

interface ResData {
  accessToken: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeSlideInOutAnimation],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  blockSpace: RegExp = /[^\s]/;

  formFields = {
    userId: '',
    userPwd: '',
  };

  isLoading$: Observable<boolean>;

  constructor(
    private messageService: MessageService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isLoading$ = this.store.select('loader');
  }

  ngOnInit() {
    if (localStorage.getItem('accessToken')) {
      this.router.navigate(['patients']);
    } else {
      document.title = 'SGP ‣ Connexion';

      if (this.route.snapshot.queryParamMap.get('sessionExpired') === 'true') {
        setTimeout(() => {
          this.show('info', 'Votre session a expiré.');
        }, 1000);
      }
    }
  }

  handleLogin() {
    this.clear();
    const { userId, userPwd } = this.formFields;

    if (userId === '' && userPwd === '')
      this.show('info', "Entrer l'identifiant et le mot de passe d'abord.");
    else if (userId === '') this.show('info', "Entrer l'identifiant d'abord.");
    else if (userPwd === '')
      this.show('info', "Entrer le mot de passe d'abord.");
    else {
      this.showProgressBar();

      axios
        .post(`${baseUrl}/auth/login`, this.formFields)
        .then((res: AxiosResponse<ResData>) => {
          if (res.data.accessToken === 'NO_ACCESS_TOKEN') {
            this.hideProgressBar(() => {
              this.show('error', 'Combinison invalide.');
            });
          } else {
            this.hideProgressBar(() => {
              localStorage.setItem('accessToken', res.data.accessToken);
              this.store.dispatch({ type: 'SET_LOGGED_IN' });
              this.router.navigate(['patients'], {
                queryParams: { newlyConnected: true },
              });
            });
          }
        })
        .catch((err: AxiosError) => {
          this.hideProgressBar(() => {
            this.show('error', 'Une erreur est survenue.');
          });
        });
    }
  }

  clear() {
    this.messageService.clear();
  }

  show(type: string, msg: string) {
    this.messageService.add({
      severity: type,
      summary: msg,
    });
  }

  showProgressBar() {
    this.store.dispatch({ type: 'START_LOADING' });
  }

  hideProgressBar(callback: () => void) {
    setTimeout(() => {
      this.store.dispatch({ type: 'STOP_LOADING' });
      callback();
    }, 2000);
  }
}
