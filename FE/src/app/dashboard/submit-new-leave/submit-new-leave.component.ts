import { MatSnackBar } from '@angular/material/snack-bar';
import { LeaveService } from './../../__services__/leave.service';
import { Employee } from 'src/app/__services__/user.service';
import { Component, OnInit } from '@angular/core';
import { fadeSlideInOutAnimation } from './../../__utils__/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import jwt_decode from 'jwt-decode';
import 'moment/locale/fr';

import { LeaveDemand } from 'src/app/__services__/leave.service';

@Component({
  selector: 'app-submit-new-leave',
  templateUrl: './submit-new-leave.component.html',
  styleUrls: ['./submit-new-leave.component.scss'],
  animations: [fadeSlideInOutAnimation],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class SubmitNewLeaveComponent implements OnInit {
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  id!: number;
  gender!: string;

  startDate: Date | null = null;

  constructor(
    private _formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
    private leaveService: LeaveService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      leaveType: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

    // @ts-ignore
    const accessToken: string = localStorage.getItem('accessToken');
    const employee: Employee = (jwt_decode(accessToken) as any).employee;
    this.id = employee.id;
    this.gender = employee.gender;

    this._adapter.setLocale('fr');
    // this.firstFormGroup.controls.leaveType.setValue('Annuel');

    this.leaveService.getDemands().subscribe((res) => {});
  }

  handleDemandSubmit(stepper: any) {
    const demand: LeaveDemand = {
      id: -1,
      employeeId: this.id,
      leaveType: this.firstFormGroup.controls.leaveType.value,
      startDate: this.secondFormGroup.controls.startDate.value.valueOf(),
      endDate: this.secondFormGroup.controls.endDate.value.valueOf(),
      // submitDate: new Date().getTime().toString(),
    };

    this.leaveService.addDemand(demand).subscribe(() => {});
    this._snackBar.open('Demande soumis avec succès.', 'OK', {
      duration: 16000,
    });

    stepper.previous();
    stepper.previous();
  }
}
