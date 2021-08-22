import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { AppState } from '../app.component';
import { Patient } from '../__models__/patient.model';
import { baseUrl } from '../__utils__/baseUrl';
import { getCurrentDate } from '../__utils__/useful';
import jwt_decode from 'jwt-decode';

interface CreatePatientResponse {
  status: string;
  patientNb: number;
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

  newPatient!: Patient;
  isLoading$: Observable<boolean>;

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.initializeNewPatient();

    document.title = `SGP ‣ Ajout d'un patient`;

    this.checkToken();
  }

  initializeNewPatient() {
    this.newPatient = {
      patientNb: 0,
      patientId: '',
      lastname: '',
      firstname: '',
      nicNb: '',
      phoneNb: '',
      birthday: '',
      addday: '',
      parentName: '',
    };
  }

  handleAutofill() {
    this.newPatient.addday = getCurrentDate();
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
      !this.newPatient.patientId ||
      !this.newPatient.lastname ||
      !this.newPatient.firstname ||
      !this.newPatient.nicNb ||
      !this.newPatient.phoneNb ||
      !this.newPatient.birthday ||
      !this.newPatient.addday ||
      !this.newPatient.parentName
    ) {
      this.show('info', "Remplir tous les champs d'abord.");
    } else {
      this.store.dispatch({ type: 'START_LOADING' });

      const accessToken = localStorage.getItem('accessToken');
      axios
        .post(`${baseUrl}/patients`, this.newPatient, {
          headers: { Authorization: accessToken },
        })
        .then((res: AxiosResponse<CreatePatientResponse>) => {
          console.log(this.newPatient.patientId);
          setTimeout(() => {
            this.show(
              'success',
              `Enregistrement d'identifiant ${this.newPatient.patientId} ajouté avec succès.`
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
