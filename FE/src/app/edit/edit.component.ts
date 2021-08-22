import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppState } from '../app.component';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Patient } from '../__models__/patient.model';
import { baseUrl } from '../__utils__/baseUrl';
import { Observable } from 'rxjs';
import { getCurrentDate } from '../__utils__/useful';
import jwt_decode from 'jwt-decode';

interface UpdatePatientResponse {
  status: string;
}

interface GetPatientResponse {
  patient: Patient[];
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [MessageService],
})
export class EditComponent implements OnInit {
  id!: number;
  newPatient!: Patient;
  fixedPatientId!: string;
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
    this.initializeNewPatient();

    this.route.params.subscribe((params) => {
      this.id = +params['id'];
    });

    this.checkToken();

    const accessToken = localStorage.getItem('accessToken');
    axios
      .get(`${baseUrl}/patients/${this.id}`, {
        headers: { Authorization: accessToken },
      })
      .then((res: AxiosResponse<GetPatientResponse>) => {
        if (res.data.patient.length === 1) {
          this.newPatient = res.data.patient[0];
          this.fixedPatientId = this.newPatient.patientId;
          document.title = `SGP ‣ Patient ${this.fixedPatientId}`;
        } else {
          this.router.navigate(['patients']);
        }
      })
      .catch((err: AxiosError) => {
        this.show('error', 'Une erreur est survenue.');
      });
  }

  handleAutofill() {
    this.newPatient.addday = getCurrentDate();
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
        .patch(`${baseUrl}/patients`, this.newPatient, {
          headers: { Authorization: accessToken },
        })
        .then((res: AxiosResponse<UpdatePatientResponse>) => {
          setTimeout(() => {
            this.fixedPatientId = this.newPatient.patientId;
            this.show(
              'success',
              `Enregistrement ${this.fixedPatientId} modifié avec succès.`
            );
            document.title = `SGP ‣ Patient ${this.fixedPatientId}`;
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
