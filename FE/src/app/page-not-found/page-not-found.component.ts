import { Component } from '@angular/core';
import { fadeSlideInOutAnimation } from './../__utils__/animations';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  animations: [fadeSlideInOutAnimation],
})
export class PageNotFoundComponent {}
