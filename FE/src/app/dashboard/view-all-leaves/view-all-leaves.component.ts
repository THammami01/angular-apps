import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LeaveDemand, LeaveService } from 'src/app/__services__/leave.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { fadeSlideInOutAnimation } from './../../__utils__/animations';
import { changeMySQLDate } from 'src/app/__utils__/useful';
import { Employee } from 'src/app/__services__/user.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-view-all-leaves',
  templateUrl: './view-all-leaves.component.html',
  styleUrls: ['./view-all-leaves.component.scss'],
  animations: [fadeSlideInOutAnimation],
})
export class ViewAllLeavesComponent implements OnInit {
  demands?: LeaveDemand[];

  selectedType = 'Tous';

  displayedColumns: string[] = [
    'id',
    'demandType',
    'startDate',
    'endDate',
    'submitDate',
    'updateDate',
    'demandStatus',
    'action',
  ];

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private leaveService: LeaveService
  ) {}

  ngOnInit(): void {
    this.fetchDemands();
  }

  get filteredDemands() {
    if (this.selectedType === 'Tous') return this.demands;
    else
      return this.demands?.filter((demand) => {
        return demand.demandStatus === this.selectedType;
      });
  }

  fetchDemands() {
    // @ts-ignore
    const accessToken: string = localStorage.getItem('accessToken');
    const tokenData: Employee = (jwt_decode(accessToken) as any).employee;

    this.leaveService.getDemandsOfEmployee(tokenData.id).subscribe((res) => {
      this.updateDemandsDates(res);
    });
  }

  updateDemandsDates(res: LeaveDemand[]) {
    // @ts-ignore
    const demands: LeaveDemand[] = res.map((demand: LeaveDemand) => {
      return {
        ...demand,
        // @ts-ignore
        submitDate: changeMySQLDate(demand.submitDate),
        startDate: moment(new Date(parseInt(demand.startDate))).format(
          'DD/MM/YYYY'
        ),
        endDate: moment(new Date(parseInt(demand.endDate))).format(
          'DD/MM/YYYY'
        ),
        // @ts-ignore
        updateDate: changeMySQLDate(demand.updateDate),
      };
    });

    this.demands = demands;
  }

  deleteDemand(id: number, demandStatus: string) {
    this.leaveService.validateDemand(id, demandStatus).subscribe((res) => {
      this.fetchDemands();

      this._snackBar.open('Demande supprimée avec succès.', 'OK', {
        duration: 8000,
      });
    });
  }
}
