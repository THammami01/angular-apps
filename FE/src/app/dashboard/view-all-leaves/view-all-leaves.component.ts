import { Component, OnInit } from '@angular/core';
import { fadeSlideInOutAnimation } from 'src/app/__utils__/animations';

@Component({
  selector: 'app-view-all-leaves',
  templateUrl: './view-all-leaves.component.html',
  styleUrls: ['./view-all-leaves.component.scss'],
  animations: [fadeSlideInOutAnimation],
})
export class ViewAllLeavesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
