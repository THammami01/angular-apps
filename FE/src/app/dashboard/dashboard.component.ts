import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { AppState } from '../app.component';
import { fadeSlideInOutAnimation } from './../__utils__/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { baseUrl } from '../__utils__/baseUrl';
// import jwt_decode from 'jwt-decode';

// interface User {
//   userNb: number;
//   userId: string;
//   userPwd: string;
// }

interface Incident {
  incidentNb: number;
  sourcePost: string;
  voltage: number;
  departure: string;
  aSType: string;
  incidentType: string;
  startDatetime: string;
  firstRecoveryDatetime: string;
  endDatetime: string;
  cutOff: number;
  recovery: number;
  section: string;
  observations: string;
}

// interface UsersResponse {
//   users: User[];
// }

interface IncidentsResponse {
  incidents: Incident[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [fadeSlideInOutAnimation],
  providers: [ConfirmationService, MessageService],
})
export class DashboardComponent implements OnInit {
  // users: User[] = [];
  incidents: Incident[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);

    if (!localStorage.getItem('accessToken')) {
      this.router.navigate(['']);
    }

    if (this.route.snapshot.queryParamMap.get('newlyConnected') === 'true') {
      // alert('Vous êtes connectés');
      // this.show('success', 'Vous êtes connectés.');
    }

    document.title = 'STEG ‣ Liste des incidents';

    axios
      .get(`${baseUrl}/incidents`)
      .then((res: AxiosResponse<IncidentsResponse>) => {
        this.incidents = res.data.incidents;
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  }

  handleEdit(incidentNb: number) {
    this.store.dispatch({ type: 'START_LOADING' });

    setTimeout(() => {
      this.router.navigate(['incidents', incidentNb, 'edit']);
      this.store.dispatch({ type: 'STOP_LOADING' });
    }, 1000);
  }

  handleDelete(event: Event, incidentNb: number) {
    this.confirmationService.confirm({
      // @ts-ignore
      target: event.target,
      message: 'Voulez-vous vraiment supprimer cet enregistrement ?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => {
        axios
          .delete(`${baseUrl}/incidents/${incidentNb}`)
          .then(() => {
            this.incidents = this.incidents.filter(
              (incident) => incident.incidentNb !== incidentNb
            );
            this.show(
              'info',
              `Enregistrement ${incidentNb} supprimé avec succès.`
            );
          })
          .catch((err: AxiosError) => {
            console.log(err);
          });
      },
      reject: () => {
        console.log('REFUSED');
      },
    });
  }

  show(type: string, msg: string) {
    this.messageService.add({
      severity: type,
      summary: msg,
    });
  }

  handleAdd() {
    this.store.dispatch({ type: 'START_LOADING' });

    setTimeout(() => {
      this.router.navigate(['incidents', 'add']);
      this.store.dispatch({ type: 'STOP_LOADING' });
    }, 1000);
  }
}
