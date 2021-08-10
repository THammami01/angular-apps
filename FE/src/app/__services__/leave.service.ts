import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface LeaveDemand {
  id: number;
  employeeId: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  // submitStatus: string;
  // submitDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  demandsUrl = 'http://localhost:4000/demands';

  constructor(private http: HttpClient) {}

  handleError(err: HttpErrorResponse) {
    const errMsg = 'An error occured. Please try again.';
    return throwError(errMsg);
  }

  getDemands(): Observable<LeaveDemand[]> {
    return this.http
      .get<LeaveDemand[]>(this.demandsUrl)
      .pipe(catchError(this.handleError));
  }

  addDemand(demand: LeaveDemand): Observable<LeaveDemand> {
    return this.http
      .post<LeaveDemand>(`${this.demandsUrl}`, demand)
      .pipe(catchError(this.handleError));
  }

  // updateEmployee(employee: Employee): Observable<Employee> {
  //   return this.http
  //     .patch<Employee>(`${this.employeesUrl}/${employee.id}`, employee)
  //     .pipe(catchError(this.handleError));
  // }

  // deleteEmployee(id: number): Observable<Employee> {
  //   return this.http
  //     .delete<Employee>(`${this.employeesUrl}/${id}`)
  //     .pipe(catchError(this.handleError));
  // }
}
