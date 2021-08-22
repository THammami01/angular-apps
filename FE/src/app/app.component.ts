import { baseUrl } from './__utils__/baseUrl';
import { PrimeNGConfig } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import axios, { AxiosError, AxiosResponse } from 'axios';
import jwt_decode from 'jwt-decode';

export interface AppState {
  loader: boolean;
  login: boolean;
}

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
  providers: [MessageService],
})
export class AppComponent implements OnInit {
  isLoading$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;
  connectedUser!: { chipText: string; chipImage: string };
  justStarted = true;
  items: MenuItem[] = [
    {
      label: 'Paramètres de profil',
      items: [
        {
          label: 'Changer le mot de passe',
          icon: 'pi pi-key',
          command: () => {
            this.isChangePwdModalDisplayed = true;
          },
        },
      ],
    },
    {
      label: 'Session',
      items: [
        {
          label: 'Se déconnecter',
          icon: 'pi pi-sign-out',
          command: () => {
            this.handleLogout();
          },
        },
      ],
    },
  ];

  isChangePwdModalDisplayed = false;
  blockSpace: RegExp = /[^\s]/;
  pwds = {
    oldPwd: '',
    newPwd: '',
    newPwdAgain: '',
  };

  constructor(
    private store: Store<AppState>,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private messageService: MessageService
  ) {
    this.isLoading$ = this.store.select('loader');
    this.isLoggedIn$ = this.store.select('login');
  }

  ngOnInit() {
    // this.primengConfig.ripple = true;
    // TODO: REMOVE BOTTOM TWO COMMENTS

    setTimeout(() => {
      this.justStarted = false;
    }, 3000);

    if (localStorage.getItem('accessToken')) {
      this.store.dispatch({ type: 'SET_LOGGED_IN' });
    } else {
      this.store.dispatch({ type: 'SET_LOGGED_OUT' });
    }

    this.isLoggedIn$.subscribe(() => {
      if (localStorage.getItem('accessToken')) {
        // @ts-ignore
        const { userNb } = jwt_decode(localStorage.getItem('accessToken')).user;
        if (userNb === 1) {
          this.connectedUser = {
            chipText: 'Dr. Mahdi Kaabi',
            chipImage: 'doctor.png',
          };
        } else {
          this.connectedUser = {
            chipText: 'Mme Awatef Nasri',
            chipImage: 'secretary.png',
          };
        }
      }
    });
  }

  hideChangePwdModalDisplayed = () => {
    this.pwds.oldPwd = '';
    this.pwds.newPwd = '';
    this.pwds.newPwdAgain = '';

    this.isChangePwdModalDisplayed = false;
  };

  handleChangePwd() {
    const { oldPwd, newPwd, newPwdAgain } = this.pwds;

    if (!oldPwd || !newPwd || !newPwdAgain) {
      this.show('info', "Remplir tous les champs d'abord.");
    } else if(newPwd !==  newPwdAgain) {
      this.show('info', "Les valeurs du nouveau mot de passe ne correspondent pas.");
    } else if (oldPwd === newPwd || oldPwd === newPwdAgain) {
      this.show(
        'info',
        "Nouveau mot de passe doit être différent de l'ancien."
      );
    } else {
      this.store.dispatch({ type: 'START_LOADING' });

      const accessToken = localStorage.getItem('accessToken');
      axios
        .post(`${baseUrl}/auth/change-pwd`, this.pwds, {
          headers: { Authorization: accessToken },
        })
        .then((res: AxiosResponse<{ status: string }>) => {
          setTimeout(() => {
            if (res.data.status === 'INCORRECT_OLD_PWD')
              this.show('error', 'Ancien mot de passe incorrect.');
            else {
              this.isChangePwdModalDisplayed = false;
              this.pwds.oldPwd = '';
              this.pwds.newPwd = '';
              this.pwds.newPwdAgain = '';
              this.show('success', 'Mot de passe changé avec succès.');
            }

            this.store.dispatch({ type: 'STOP_LOADING' });
          }, 1000);
        })
        .catch((err: AxiosError) => {
          setTimeout(() => {
            this.show('error', 'Une erreur est survenue.');
            this.store.dispatch({ type: 'STOP_LOADING' });
          }, 1000);
        });
    }
  }

  handleLogout() {
    this.store.dispatch({ type: 'START_LOADING' });

    setTimeout(() => {
      this.store.dispatch({ type: 'SET_LOGGED_OUT' });
      localStorage.removeItem('accessToken');
      // localStorage.removeItem('savedParams');

      this.router.navigate(['']);
      this.store.dispatch({ type: 'STOP_LOADING' });
    }, 2000);
  }

  handleGoHome() {
    this.store.dispatch({ type: 'START_LOADING' });

    setTimeout(() => {
      this.router.navigate(['']);
      this.store.dispatch({ type: 'STOP_LOADING' });
    }, 1000);
  }

  show(type: string, msg: string) {
    this.messageService.clear();

    this.messageService.add({
      severity: type,
      summary: msg,
    });
  }
}
