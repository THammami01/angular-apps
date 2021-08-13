import { Component } from '@angular/core';
import { fadeSlideInOutAnimation } from './../__utils__/animations';
// import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [fadeSlideInOutAnimation],
})
export class DashboardComponent {}
