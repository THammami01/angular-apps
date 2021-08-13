import { Employee } from 'src/app/__services__/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { fadeSlideInOutAnimation } from './../__utils__/animations';
import jwt_decode from 'jwt-decode';

export interface SideNavItem {
  idx: number;
  shortTitle: string;
  title: string;
  link: string;
}

// TODO: SHOW EMPLOYEE'S NAME ON TOP RIGHT ALONG WITH THEIR POSITION AND AVATAR
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [fadeSlideInOutAnimation],
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router) {
    // @ts-ignore
    const accessToken: string = localStorage.getItem('accessToken');
    const tokenData: Employee = (jwt_decode(accessToken) as any).employee;

    const isAdmin =
      tokenData.position.toLocaleLowerCase() === 'administrateur du site';

    if (isAdmin) {
      this.sideNavItems = [
        {
          idx: 0,
          shortTitle: 'Personnel',
          title: 'Gestion du personnel',
          link: 'employees',
        },
        {
          idx: 1,
          shortTitle: 'Congés',
          title: 'Gestion des congés',
          link: 'leaves',
        },
      ];
    } else {
      this.sideNavItems = [
        {
          idx: 0,
          shortTitle: 'Soumession',
          title: "Soumession d'une demande de congé",
          link: 'submit-new-leave',
        },
        {
          idx: 1,
          shortTitle: 'Voir Tous',
          title: 'Affichage de toutes les demandes',
          link: 'view-all-leaves',
        },
      ];
    }

    this.currSelected = this.sideNavItems[0];
  }

  ngOnInit() {
    if (!localStorage.getItem('accessToken')) {
      this.router.navigate(['']);
    } else {
      this.router.navigate([`dashboard/${this.sideNavItems[0].link}`]);
    }
    window.scrollTo(0, 0);
  }

  sideNavItems!: SideNavItem[];

  currSelected!: SideNavItem;

  handleSideNav(item: SideNavItem) {
    this.currSelected = item;
  }

  handleLogout() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['']);
  }
}
