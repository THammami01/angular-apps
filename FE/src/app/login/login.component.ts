import { Component, OnInit } from '@angular/core';
import { fadeSlideInOutAnimation } from './../__utils__/animations';
// import jwt_decode from 'jwt-decode';
import { MessageService } from 'primeng/api';
import axios from 'axios';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeSlideInOutAnimation],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  formFields = {
    identifier: '',
    password: '',
  };

  message$: Observable<string>;
  vote$: Observable<number>;

  constructor(
    private store: Store<AppState>,
    private messageService: MessageService
  ) {
    this.message$ = this.store.select('message');
    this.vote$ = this.store.select('vote');
  }

  ngOnInit() {
    document.title = 'Délice ‣ Connexion';
  }

  handleLogin() {
    this.clear();
    const { identifier, password } = this.formFields;
    console.log(identifier, password);

    if (identifier === '' && password === '')
      this.show('info', "Entrer l'identifiant et le mot de passe d'abord.");
    else if (identifier === '')
      this.show('info', "Entrer l'identifiant d'abord.");
    else if (password === '')
      this.show('info', "Entrer le mot de passe d'abord.");
    else {
      axios
        .get('http://localhost:4000/auth/login')
        .then((res) => {
          this.show('info', res.data.status);
        })
        .catch(() => {
          this.show('error', 'Une erreur est survenue.');
        });
    }
  }

  show(type: string, msg: string) {
    this.messageService.add({
      severity: type,
      summary: msg,
    });
  }

  clear() {
    this.messageService.clear();
  }
}
