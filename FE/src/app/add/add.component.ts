import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { AppState } from '../app.component';
import { Incident } from '../__models__/Incident.model';
import { baseUrl } from '../__utils__/baseUrl';
import { incidentTypeOptions } from './../__utils__/incidentTypeOptions';

interface CreateIncidentResponse {
  status: string;
  incidentNb: number;
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  providers: [MessageService],
})
export class AddComponent implements OnInit {
  constructor(
    private router: Router,
    private store: Store<AppState>,
    private messageService: MessageService
  ) {
    this.isLoading$ = this.store.select('loader');
  }

  newIncident!: Incident;
  incidentTypeOptions = incidentTypeOptions;
  isLoading$: Observable<boolean>;

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.initializeNewIncident();

    document.title = `STEG ‣ Ajout d'incident`;
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
        .post(`${baseUrl}/incidents`, incidentToSend)
        .then((res: AxiosResponse<CreateIncidentResponse>) => {
          setTimeout(() => {
            this.show(
              'success',
              `Enregistrement d'identifiant ${res.data.incidentNb} ajouté avec succès.`
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
