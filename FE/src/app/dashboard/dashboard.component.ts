import { Component, OnInit } from '@angular/core';
import { fadeSlideInOutAnimation } from './../__utils__/animations';

export interface SideNavItem {
  idx: number;
  shortTitle: string;
  title: string;
  link: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [fadeSlideInOutAnimation],
})
export class DashboardComponent implements OnInit {
  ngOnInit() {
    window.scrollTo(0, 0);
  }

  sideNavItems: SideNavItem[] = [
    {
      idx: 0,
      shortTitle: 'Personnel',
      title: 'Gestion du Personnel',
      link: 'employees',
    },
    {
      idx: 1,
      shortTitle: 'Congés',
      title: 'Gestion des Congés',
      link: 'leaves',
    },
  ];

  currSelected: SideNavItem = this.sideNavItems[0];

  handleSideNav(item: SideNavItem) {
    this.currSelected = item;
  }
}
