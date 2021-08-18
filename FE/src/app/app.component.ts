import { PrimeNGConfig } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

export interface AppState {
  loader: boolean;
  login: boolean;
}

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  isLoading$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;
  justStarted = true;

  constructor(
    private store: Store<AppState>,
    private primengConfig: PrimeNGConfig,
    private router: Router
  ) {
    this.isLoading$ = this.store.select('loader');
    this.isLoggedIn$ = this.store.select('login');
  }

  ngOnInit() {
    // this.primengConfig.ripple = true;
    // TODO: REMOTE BOTTOM TWO COMMENTS
    setTimeout(() => {
      this.justStarted = false;
    }, 3000);

    if (localStorage.getItem('accessToken')) {
      this.store.dispatch({ type: 'SET_LOGGED_IN' });
    } else {
      this.store.dispatch({ type: 'SET_LOGGED_OUT' });
    }

    // this.message$.subscribe((v) => console.log('MSG', v));
  }

  handleLogout() {
    this.store.dispatch({ type: 'START_LOADING' });

    setTimeout(() => {
      this.store.dispatch({ type: 'SET_LOGGED_OUT' });
      localStorage.removeItem('accessToken');
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
}
