import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppState } from '../app.component';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { incidentTypeOptions } from '../__utils__/incidentTypeOptions';
import { Incident } from '../__models__/Incident.model';
import { baseUrl } from '../__utils__/baseUrl';
import { Observable } from 'rxjs';
import { getCurrentDatetime } from '../__utils__/useful';
import jwt_decode from 'jwt-decode';

interface UpdateIncidentResponse {
  status: string;
}

interface GetIncidentResponse {
  incident: Incident[];
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [MessageService],
})
export class EditComponent implements OnInit {
  id!: number;
  incidentTypeOptions = incidentTypeOptions;
  newIncident!: Incident;
  isLoading$: Observable<boolean>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private messageService: MessageService
  ) {
    this.isLoading$ = this.store.select('loader');
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.initializeNewIncident();

    this.route.params.subscribe((params) => {
      this.id = +params['id'];
    });

    this.checkToken();

    const accessToken = localStorage.getItem('accessToken');
    axios
      .get(`${baseUrl}/incidents/${this.id}`, {
        headers: { Authorization: accessToken },
      })
      .then((res: AxiosResponse<GetIncidentResponse>) => {
        if (res.data.incident.length === 1) {
          const incidentType = res.data.incident[0].incidentType as string;
          const incident = {
            ...res.data.incident[0],
            incidentType: incidentType === '' ? [] : incidentType.split(', '),
          };

          this.newIncident = incident;
        } else {
          this.router.navigate(['patients']);
        }
      })
      .catch((err: AxiosError) => {
        this.show('error', 'Une erreur est survenue.');
      });

    document.title = `SGP ‣ Patient ${this.id}`;
  }

  handleAutofill(key: string) {
    const generatedDate = getCurrentDatetime();

    switch (key) {
      case 'startDatetime':
        this.newIncident.startDatetime = generatedDate;
        break;
      case 'firstRecoveryDatetime':
        this.newIncident.firstRecoveryDatetime = generatedDate;
        break;
      case 'endDatetime':
        this.newIncident.endDatetime = generatedDate;
        break;
    }
  }

  initializeNewIncident() {
    this.newIncident = {
      incidentNb: 0,
      sourcePost: '',
      voltage: 0,
      departure: '',
      aSType: '',
      incidentType: [],
      startDatetime: '',
      firstRecoveryDatetime: '',
      endDatetime: '',
      cutOff: 0,
      recovery: 0,
      section: '',
      observations: '',
    };
  }

  handleGoBack() {
    this.store.dispatch({ type: 'START_LOADING' });

    setTimeout(() => {
      this.router.navigate(['']);
      this.store.dispatch({ type: 'STOP_LOADING' });
    }, 1000);
  }

  handleSave() {
    if (
      !this.newIncident.sourcePost ||
      !this.newIncident.departure ||
      !this.newIncident.aSType ||
      this.newIncident.incidentType.length === 0 ||
      !this.newIncident.startDatetime ||
      !this.newIncident.firstRecoveryDatetime ||
      !this.newIncident.endDatetime ||
      !this.newIncident.section ||
      !this.newIncident.observations
    ) {
      this.show('info', "Remplir tous les champs d'abord.");
    } else {
      this.store.dispatch({ type: 'START_LOADING' });

      const incidentToSend: Incident = {
        ...this.newIncident,
        incidentType: (this.newIncident.incidentType as string[]).join(', '),
      };

      const accessToken = localStorage.getItem('accessToken');
      axios
        .patch(`${baseUrl}/incidents`, incidentToSend, {
          headers: { Authorization: accessToken },
        })
        .then((res: AxiosResponse<UpdateIncidentResponse>) => {
          setTimeout(() => {
            this.show(
              'success',
              `Enregistrement ${this.id} modifié avec succès.`
            );
            this.store.dispatch({ type: 'STOP_LOADING' });
          }, 500);
        })
        .catch((err: AxiosError) => {
          setTimeout(() => {
            this.show('error', 'Une erreur est survenue.');
            this.store.dispatch({ type: 'STOP_LOADING' });
          }, 500);
        });
    }
  }

  show(type: string, msg: string) {
    this.messageService.add({
      severity: type,
      summary: msg,
    });
  }

  checkToken() {
    const currTimestamp = new Date().getTime();
    const tokenExpiresInTimestamp =
      // @ts-ignore
      jwt_decode(localStorage.getItem('accessToken')).exp * 1000;
    if (currTimestamp >= tokenExpiresInTimestamp) {
      this.show('info', 'Votre session a expirée.');
      this.store.dispatch({ type: 'START_LOADING' });

      setTimeout(() => {
        this.store.dispatch({ type: 'SET_LOGGED_OUT' });
        localStorage.removeItem('accessToken');

        this.router.navigate([''], {
          queryParams: { sessionExpired: true },
        });
        this.store.dispatch({ type: 'STOP_LOADING' });
      }, 2000);
    }
  }
}
