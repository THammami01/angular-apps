import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { AppState } from '../app.component';
import { fadeSlideInOutAnimation } from './../__utils__/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { baseUrl } from '../__utils__/baseUrl';
import { Patient } from '../__models__/patient.model';
import {
  getMonday,
  flattenObject,
  dynamicSort,
  changeToSortableDate,
  changeToInitialDate,
} from './../__utils__/useful';
import jwt_decode from 'jwt-decode';

interface PatientsResponse {
  patients: Patient[];
}

export interface SearchEl {
  name: string;
  code: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [fadeSlideInOutAnimation],
  providers: [ConfirmationService, MessageService],
})
export class DashboardComponent implements OnInit {
  fetchedPatients: Patient[] = [];
  isModalDisplayed = false;
  currPage = 0;
  searchKey = '';

  searchOptions = [
    { name: 'Id', code: 'patientId' },
    { name: 'Nom de famille', code: 'lastname' },
    { name: 'Prénom', code: 'firstname' },
    { name: 'CIN', code: 'nicNb' },
    { name: 'Téléphone', code: 'phoneNb' },
    { name: 'Date de naissance', code: 'birthday' },
    { name: "Date d'ajout", code: 'addday' },
    { name: 'Nom du père', code: 'parentName' },
  ];

  selectedSearchOptions: SearchEl[] = [];
  selectedOrderByOption: SearchEl = { name: 'Id', code: 'patientId' };
  selectedOrderByDirection = 'Desc.';

  datesOptions = [
    { label: "Aujourd'hui", value: "Aujourd'hui" },
    { label: 'Cette semaine', value: 'Cette semaine' },
    { label: 'Ce mois', value: 'Ce mois' },
    { label: 'Cette année', value: 'Cette année' },
    { label: 'Tous', value: 'Tous' },
  ];

  nbPerPageOptions = [
    { label: '10', value: '10' },
    { label: '20', value: '20' },
    { label: '30', value: '30' },
    { label: 'Tous', value: 'Tous' },
  ];

  selectedDateOption = 'Tous';
  selectedNbPerPage = '10';
  nbOfPatients = 0;

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

    this.checkToken();

    if (this.route.snapshot.queryParamMap.get('newlyConnected') === 'true') {
      setTimeout(() => {
        this.show('success', 'Vous êtes connectés.');
      }, 1000);
    }

    document.title = 'SGP ‣ Liste des patients';

    const accessToken = localStorage.getItem('accessToken');
    axios
      .get(`${baseUrl}/patients`, {
        headers: { Authorization: accessToken },
      })
      .then((res: AxiosResponse<PatientsResponse>) => {
        this.fetchedPatients = res.data.patients;
      })
      .catch((err: AxiosError) => {
        this.show('error', 'Une erreur est survenue.');
      });

    const savedStringifiedParams = localStorage.getItem('savedParams');
    if (savedStringifiedParams === null) {
      this.selectedSearchOptions = [];
      this.selectedOrderByOption =  { name: 'Id', code: 'patientId' };;
      this.selectedOrderByDirection = 'Desc.';
      this.selectedDateOption = 'Tous';
      this.selectedNbPerPage = '10';
      this.saveParams();
    } else {
      const savedParams = JSON.parse(savedStringifiedParams);
      this.selectedSearchOptions = savedParams.selectedSearchOptions;
      this.selectedOrderByOption = savedParams.selectedOrderByOption;
      this.selectedOrderByDirection = savedParams.selectedOrderByDirection;
      this.selectedDateOption = savedParams.selectedDateOption;
      this.selectedNbPerPage = savedParams.selectedNbPerPage;
    }
  }

  saveParams() {
    const savedParams = JSON.stringify({
      selectedSearchOptions: this.selectedSearchOptions,
      selectedOrderByOption: this.selectedOrderByOption,
      selectedOrderByDirection: this.selectedOrderByDirection,
      selectedDateOption: this.selectedDateOption,
      selectedNbPerPage: this.selectedNbPerPage,
    });

    localStorage.setItem('savedParams', savedParams);
  }

  get filteredPatients() {
    const today = new Date();
    const todayArr = [
      today.getDate(),
      today.getMonth() + 1,
      today.getFullYear(),
    ];

    let res;
    if (this.selectedDateOption === "Aujourd'hui") {
      res = this.fetchedPatients.filter(({ addday }) => {
        const tempDate = addday
          .split(' ')[0]
          .split('/')
          .map((el) => +el);

        return (
          tempDate[0] === todayArr[0] &&
          tempDate[1] === todayArr[1] &&
          tempDate[2] === todayArr[2]
        );
      });
    } else if (this.selectedDateOption === 'Cette semaine') {
      const mondayTimestamp = getMonday(new Date()).setHours(0, 0, 0, 0);

      res = this.fetchedPatients.filter(({ addday }) => {
        const tempDate = addday
          .split(' ')[0]
          .split('/')
          .map((el) => +el);

        const adddayTimestamp = new Date(
          Date.parse(`${tempDate[1]}/${tempDate[0]}/${tempDate[2]}`)
        ).setHours(0, 0, 0, 0);

        return adddayTimestamp >= mondayTimestamp;
      });
    } else if (this.selectedDateOption === 'Ce mois') {
      // TODO: FIX SGI, SAME KEY USED IN tempDate AND tempDate2
      res = this.fetchedPatients.filter(({ addday }) => {
        const tempDate = addday
          .split(' ')[0]
          .split('/')
          .map((el) => +el);

        return tempDate[1] === todayArr[1] && tempDate[2] === todayArr[2];
      });
    } else if (this.selectedDateOption === 'Cette année') {
      res = this.fetchedPatients.filter(({ addday }) => {
        const tempDate = addday
          .split(' ')[0]
          .split('/')
          .map((el) => +el);

        return tempDate[2] === todayArr[2];
      });
    } else {
      res = this.fetchedPatients;
    }

    const includeOnly: string[] = this.selectedSearchOptions.map(
      (el) => el.code
    );

    let resFilteredByKey = res.filter((patient) =>
      flattenObject(patient, includeOnly)
        .toLowerCase()
        .includes(this.searchKey.toLowerCase())
    );
    this.nbOfPatients = resFilteredByKey.length;

    if (
      this.selectedOrderByOption.code === 'addday' ||
      this.selectedOrderByOption.code === 'birthday'
    ) {
      resFilteredByKey = resFilteredByKey.map((el) => {
        return {
          ...el,
          [this.selectedOrderByOption.code]: changeToSortableDate(
            // @ts-ignore
            el[this.selectedOrderByOption.code]
          ),
        };
      });
    }

    resFilteredByKey.sort(dynamicSort(this.selectedOrderByOption.code));

    if (
      this.selectedOrderByOption.code === 'addday' ||
      this.selectedOrderByOption.code === 'birthday'
    ) {
      resFilteredByKey = resFilteredByKey.map((el) => {
        return {
          ...el,
          [this.selectedOrderByOption.code]: changeToInitialDate(
            // @ts-ignore
            el[this.selectedOrderByOption.code]
          ),
        };
      });
    }

    if (this.selectedOrderByDirection === 'Asc.')
      resFilteredByKey = resFilteredByKey.reverse();

    return this.getPage(resFilteredByKey);
  }

  getPage(res: any) {
    if (this.selectedNbPerPage === 'Tous') return res;
    else {
      const firstItem = this.currPage * +this.selectedNbPerPage;
      let lastItem = firstItem + parseInt(this.selectedNbPerPage) - 1;

      return res.slice(firstItem, lastItem + 1);
    }
  }

  paginate(event: any) {
    window.scrollTo(0, 80);
    this.currPage = event.page;
  }

  displayModal() {
    this.isModalDisplayed = !this.isModalDisplayed;
  }

  handlePaginate() {
    window.scrollTo(0, 0);
  }

  handleEdit(patientNb: number) {
    this.store.dispatch({ type: 'START_LOADING' });

    setTimeout(() => {
      this.router.navigate(['patients', patientNb, 'edit']);
      this.store.dispatch({ type: 'STOP_LOADING' });
    }, 1000);
  }

  handleDelete(event: Event, patientId: string, patientNb: number) {
    this.confirmationService.confirm({
      // @ts-ignore
      target: event.target,
      message: 'Voulez-vous vraiment supprimer cet enregistrement ?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => {
        const accessToken = localStorage.getItem('accessToken');
        axios
          .delete(`${baseUrl}/patients/${patientNb}`, {
            headers: { Authorization: accessToken },
          })
          .then(() => {
            this.fetchedPatients = this.fetchedPatients.filter(
              (patient) => patient.patientNb !== patientNb
            );
            this.show(
              'info',
              `Enregistrement ${patientId} supprimé avec succès.`
            );
          })
          .catch((err: AxiosError) => {
            this.show('error', 'Une erreur est survenue.');
          });
      },
      reject: () => {},
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
      this.router.navigate(['patients', 'add']);
      this.store.dispatch({ type: 'STOP_LOADING' });
    }, 1000);
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
