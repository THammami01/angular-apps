import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LeaveDemand, LeaveService } from 'src/app/__services__/leave.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { fadeSlideInOutAnimation } from './../../__utils__/animations';
import { changeMySQLDate } from 'src/app/__utils__/useful';

@Component({
  selector: 'app-leaves-mg',
  templateUrl: './leaves-mg.component.html',
  styleUrls: ['./leaves-mg.component.scss'],
  animations: [fadeSlideInOutAnimation],
})
export class LeavesMgComponent implements OnInit {
  demands?: LeaveDemand[];

  selectedType = 'Tous';

  displayedColumns: string[] = [
    'id',
    'demandType',
    'employee',
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
    this.leaveService.getDemands().subscribe((res) => {
      // this.demands = res;
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

  validateDemand(id: number, demandStatus: string) {
    this.leaveService.validateDemand(id, demandStatus).subscribe((res) => {
      this.fetchDemands();

      switch (demandStatus) {
        case 'Acceptée':
        case 'Non Acceptée':
          this._snackBar.open('Demande mis à jour avec succès.', 'OK', {
            duration: 3000,
          });
          break;
        case 'Supprimée':
          this._snackBar.open('Demande supprimée avec succès.', 'OK', {
            duration: 8000,
          });
          break;
      }
    });
  }
}
