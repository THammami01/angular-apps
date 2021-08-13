import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { AppState } from '../app.component';
import { fadeSlideInOutAnimation } from './../__utils__/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { baseUrl } from '../__utils__/baseUrl';
import { Incident } from '../__models__/Incident.model';
import { getMonday, flattenObject, dynamicSort } from './../__utils__/useful';
import jwt_decode from 'jwt-decode';

// interface User {
//   userNb: number;
//   userId: string;
//   userPwd: string;
// }

// interface UsersResponse {
//   users: User[];
// }

interface IncidentsResponse {
  incidents: Incident[];
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
  // users: User[] = [];
  fetchedIncidents: Incident[] = [];
  isModalDisplayed = false;
  currPage = 0;
  searchKey = '';

  searchOptions = [
    { name: 'Id', code: 'incidentNb' },
    { name: 'Poste Source', code: 'sourcePost' },
    { name: 'Tension', code: 'voltage' },
    { name: 'Départ', code: 'departure' },
    { name: 'Type A/S', code: 'aSType' },
    { name: 'Type Incident', code: 'incidentType' },
    { name: 'Début', code: 'startDatetime' },
    { name: '1er Rétablissement', code: 'firstRecoveryDatetime' },
    { name: 'Fin', code: 'endDatetime' },
    { name: 'Courant Coupé', code: 'cutOff' },
    { name: 'Courant 1er Rétablissement', code: 'recovery' },
    { name: 'Trançon Coucerné', code: 'section' },
    { name: 'Observations', code: 'observations' },
  ];

  selectedSearchOptions: SearchEl[] = [];
  selectedOrderByOption: SearchEl = { name: 'Id', code: 'incidentNb' };
  selectedOrderByDirction = 'Desc.';

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
  nbOfIncident = 0;

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

    document.title = 'STEG ‣ Liste des incidents';

    const accessToken = localStorage.getItem('accessToken');
    axios
      .get(`${baseUrl}/incidents`, {
        headers: { Authorization: accessToken },
      })
      .then((res: AxiosResponse<IncidentsResponse>) => {
        this.fetchedIncidents = res.data.incidents;
      })
      .catch((err: AxiosError) => {
        this.show('error', 'Une erreur est survenue.');
      });

    const savedStringifiedParams = localStorage.getItem('savedParams');
    if (savedStringifiedParams !== null) {
      const savedParams = JSON.parse(savedStringifiedParams);
      this.selectedSearchOptions = savedParams.selectedSearchOptions;
      this.selectedOrderByOption = savedParams.selectedOrderByOption;
      this.selectedOrderByDirction = savedParams.selectedOrderByDirction;
      this.selectedDateOption = savedParams.selectedDateOption;
      this.selectedNbPerPage = savedParams.selectedNbPerPage;
    }
  }

  saveParams() {
    const savedParams = JSON.stringify({
      selectedSearchOptions: this.selectedSearchOptions,
      selectedOrderByOption: this.selectedOrderByOption,
      selectedOrderByDirction: this.selectedOrderByDirction,
      selectedDateOption: this.selectedDateOption,
      selectedNbPerPage: this.selectedNbPerPage,
    });

    localStorage.setItem('savedParams', savedParams);
  }

  get filteredIncidents() {
    const today = new Date();
    const todayArr = [
      today.getDate(),
      today.getMonth() + 1,
      today.getFullYear(),
    ];

    let res;
    if (this.selectedDateOption === "Aujourd'hui") {
      res = this.fetchedIncidents.filter(({ startDatetime, endDatetime }) => {
        const tempDate = startDatetime
          .split(' ')[0]
          .split('/')
          .map((el) => +el);
        const tempDate2 = endDatetime
          .split(' ')[0]
          .split('/')
          .map((el) => +el);

        return (
          (tempDate[0] === todayArr[0] &&
            tempDate[1] === todayArr[1] &&
            tempDate[2] === todayArr[2]) ||
          (tempDate2[0] === todayArr[0] &&
            tempDate2[1] === todayArr[1] &&
            tempDate2[2] === todayArr[2])
        );
      });
    } else if (this.selectedDateOption === 'Cette semaine') {
      const mondayTimestamp = getMonday(new Date()).getTime();

      res = this.fetchedIncidents.filter(({ startDatetime, endDatetime }) => {
        const tempDate = startDatetime
          .split(' ')[0]
          .split('/')
          .map((el) => +el);
        const tempDate2 = endDatetime
          .split(' ')[0]
          .split('/')
          .map((el) => +el);

        const startDateTimestamp = new Date(
          Date.parse(`${tempDate[1]}/${tempDate[0]}/${tempDate[2]}`)
        ).getTime();

        const endDateTimestamp = new Date(
          Date.parse(`${tempDate2[1]}/${tempDate2[0]}/${tempDate2[2]}`)
        ).getTime();

        return (
          startDateTimestamp >= mondayTimestamp ||
          endDateTimestamp >= mondayTimestamp
        );
      });
    } else if (this.selectedDateOption === 'Ce mois') {
      res = this.fetchedIncidents.filter(({ startDatetime }) => {
        const tempDate = startDatetime
          .split(' ')[0]
          .split('/')
          .map((el) => +el);
        const tempDate2 = startDatetime
          .split(' ')[0]
          .split('/')
          .map((el) => +el);

        return (
          (tempDate[1] === todayArr[1] && tempDate[2] === todayArr[2]) ||
          (tempDate2[1] === todayArr[1] && tempDate2[2] === todayArr[2])
        );
      });
    } else if (this.selectedDateOption === 'Cette année') {
      res = this.fetchedIncidents.filter(({ startDatetime }) => {
        const tempDate = startDatetime
          .split(' ')[0]
          .split('/')
          .map((el) => +el);

        const tempDate2 = startDatetime
          .split(' ')[0]
          .split('/')
          .map((el) => +el);

        return tempDate[2] === todayArr[2] || tempDate2[2] === todayArr[2];
      });
    } else {
      res = this.fetchedIncidents;
    }

    const includeOnly: string[] = this.selectedSearchOptions.map(
      (el) => el.code
    );

    let resFilteredByKey = res.filter((incident) =>
      flattenObject(incident, includeOnly)
        .toLowerCase()
        .includes(this.searchKey.toLowerCase())
    );
    this.nbOfIncident = resFilteredByKey.length;

    resFilteredByKey.sort(dynamicSort(this.selectedOrderByOption.code));

    if (this.selectedOrderByDirction === 'Asc.')
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
        const accessToken = localStorage.getItem('accessToken');
        axios
          .delete(`${baseUrl}/incidents/${incidentNb}`, {
            headers: { Authorization: accessToken },
          })
          .then(() => {
            this.fetchedIncidents = this.fetchedIncidents.filter(
              (incident) => incident.incidentNb !== incidentNb
            );
            this.show(
              'info',
              `Enregistrement ${incidentNb} supprimé avec succès.`
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
      this.router.navigate(['incidents', 'add']);
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
