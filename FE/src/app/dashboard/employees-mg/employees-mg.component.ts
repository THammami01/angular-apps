// // @ts-nocheck
import { Component, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { fadeSlideInOutAnimation } from './../../__utils__/animations';
import { Employee, EmployeeService } from 'src/app/__services__/user.service';
import { flattenObject } from 'src/app/__utils__/useful';

import { Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface EmployeeDialogData {
  employee?: Employee;
  fetchEmployees: () => void;
}

// ==================================
// ====== ADD EMPLOYEE DIALOAG ======
// ==================================
@Component({
  selector: 'app-add-employee-dialog',
  templateUrl: './add-employee-dialog.component.html',
})
export class AddEmployeeDialog {
  employee: Employee = {
    id: Math.random(),
    registration: '',
    firstname: '',
    lastname: '',
    position: '',
    phone: '',
    email: '',
    passkey: '',
  };

  constructor(
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeDialogData,
    private employeeService: EmployeeService
  ) {}

  handleClick() {
    this.employeeService.addEmployee(this.employee).subscribe(() => {});
    this._snackBar.open('Employé ajouté avec succès.', 'OK', {
      duration: 8000,
    });
    this.data.fetchEmployees();
    this.data.fetchEmployees();
  }
}
// ==================================
// ==================================
// ==================================

// ==================================
// ===== UPDATE EMPLOYEE DIALOAG ====
// ==================================

@Component({
  selector: 'app-update-employee-dialog',
  templateUrl: './update-employee-dialog.component.html',
})
export class UpdateEmployeeDialog {
  employee!: Employee;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EmployeeDialogData,
    private employeeService: EmployeeService,
    private _snackBar: MatSnackBar
  ) {
    // @ts-ignore
    this.employee = { ...this.data.employee };
  }

  handleClick() {
    this.employeeService.updateEmployee(this.employee).subscribe(() => {});
    this._snackBar.open('Employé mis à jour avec succès.', 'OK', {
      duration: 8000,
    });
    this.data.fetchEmployees();
    this.data.fetchEmployees();
  }
}
// ==================================
// ==================================
// ==================================

// ==================================
// ===== DELETE EMPLOYEE DIALOAG ====
// ==================================
@Component({
  selector: 'app-delete-employee-dialog',
  templateUrl: './delete-employee-dialog.component.html',
})
export class DeleteEmployeeDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EmployeeDialogData,
    private employeeService: EmployeeService,
    private _snackBar: MatSnackBar
  ) {}

  get employee() {
    return this.data.employee;
  }

  handleClick() {
    // @ts-ignore
    this.employeeService.deleteEmployee(this.employee.id).subscribe(() => {});
    this._snackBar.open('Employé supprimé avec succés.', 'OK', {
      duration: 8000,
    });
    this.data.fetchEmployees();
    this.data.fetchEmployees();
  }
}
// ==================================
// ==================================
// ==================================

// TODO: ADD PAGINATION
@Component({
  selector: 'app-employees-mg',
  templateUrl: './employees-mg.component.html',
  styleUrls: ['./employees-mg.component.scss'],
  animations: [fadeSlideInOutAnimation],
})
export class EmployeesMgComponent implements OnInit {
  employees?: Employee[];

  displayedColumns: string[] = [
    'registration',
    'name',
    'position',
    'phone',
    'email',
    'update',
  ];

  filterKey = '';

  constructor(
    public dialog: MatDialog,
    private employeesService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  get filteredEmployees() {
    return this.employees?.filter((employee) => {
      return flattenObject(employee)
        .toLowerCase()
        .includes(this.filterKey.toLowerCase());
    });
  }

  fetchEmployees() {
    this.employeesService.getEmployees().subscribe((res) => {
      this.employees = res;
    });
  }

  openDialog(dialogName: string, employee?: Employee) {
    let dialogRef;

    switch (dialogName) {
      case 'add-employee':
        dialogRef = this.dialog.open(AddEmployeeDialog, {
          data: { employee, fetchEmployees: this.fetchEmployees.bind(this) },
        });
        break;

      case 'update-employee':
        dialogRef = this.dialog.open(UpdateEmployeeDialog, {
          data: { employee, fetchEmployees: this.fetchEmployees.bind(this) },
        });
        break;

      case 'delete-employee':
        dialogRef = this.dialog.open(DeleteEmployeeDialog, {
          data: { employee, fetchEmployees: this.fetchEmployees.bind(this) },
        });
        break;

      default:
        dialogRef = null;
    }

    // dialogRef?.afterClosed().subscribe((result) => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
}
