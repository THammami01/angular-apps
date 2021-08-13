import { fadeSlideInOutAnimation } from './../__utils__/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  animations: [fadeSlideInOutAnimation],
})
export class PageNotFoundComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
