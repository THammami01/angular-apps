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

    axios
      .get(`${baseUrl}/incidents/${this.id}`)
      .then((res: AxiosResponse<GetIncidentResponse>) => {
        if (res.data.incident.length === 1) {
          const incident = {
            ...res.data.incident[0],
            incidentType: (res.data.incident[0].incidentType as string).split(
              ', '
            ),
          };

          this.newIncident = incident;
        } else {
          this.router.navigate(['incidents']);
        }
      })
      .catch((err: AxiosError) => {
        this.show('error', 'Une erreur est survenue.');
      });

    document.title = `STEG ‣ Incident ${this.id}`;
  }

  initializeNewIncident() {
    this.newIncident = {
      incidentNb: 0,
      sourcePost: '',
      voltage: 0,
      departure: '',
      aSType: '',
      incidentType: '',
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
      !this.newIncident.incidentType ||
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

      axios
        .patch(`${baseUrl}/incidents`, incidentToSend)
        .then((res: AxiosResponse<UpdateIncidentResponse>) => {
          setTimeout(() => {
            this.show(
              'success',
              `Enregistrement d'identifiant ${this.id} modifié avec succès.`
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
}
