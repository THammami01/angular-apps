import { PrimeNGConfig } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

export interface AppState {
  message: string;
  vote: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  message$: Observable<string>;
  vote$: Observable<number>;

  constructor(
    private store: Store<AppState>,
    private primengConfig: PrimeNGConfig
  ) {
    this.message$ = this.store.select('message');
    this.vote$ = this.store.select('vote');
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    // this.message$.subscribe((v) => console.log('MSG', v));
  }

  spanishMessage() {
    this.store.dispatch({ type: 'SPANISH' });
  }

  frenchMessage() {
    this.store.dispatch({ type: 'FRENCH' });
  }

  upvote() {
    this.store.dispatch({ type: 'UPVOTE' });
  }

  downvote() {
    this.store.dispatch({ type: 'DOWNVOTE' });
  }
}
