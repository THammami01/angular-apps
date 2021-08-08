import { Component, OnInit } from '@angular/core';
import { fadeSlideInOutAnimation } from './../../__utils__/animations';

@Component({
  selector: 'app-leaves-mg',
  templateUrl: './leaves-mg.component.html',
  styleUrls: ['./leaves-mg.component.scss'],
  animations: [fadeSlideInOutAnimation]
})
export class LeavesMgComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
