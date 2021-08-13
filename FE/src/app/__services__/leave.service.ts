import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface LeaveDemand {
  id: number;
  employeeId: number;
  employeeName?: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  demandStatus?: string;
  submitDate?: string;
  updateDate?: string;
}

interface DemandToValidate {
  demandStatus: string;
}

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  // demandsUrl = 'http://localhost:4000/demands';
  demandsUrl = '/demands';

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

  getDemandsOfEmployee(employeeId: number): Observable<LeaveDemand[]> {
    return this.http
      .get<LeaveDemand[]>(`${this.demandsUrl}/employee/${employeeId}`)
      .pipe(catchError(this.handleError));
  }

  addDemand(demand: LeaveDemand): Observable<LeaveDemand> {
    return this.http
      .post<LeaveDemand>(`${this.demandsUrl}`, demand)
      .pipe(catchError(this.handleError));
  }

  validateDemand(
    id: number,
    demandStatus: string
  ): Observable<DemandToValidate> {
    return this.http
      .patch<DemandToValidate>(`${this.demandsUrl}/validate/${id}`, {
        demandStatus,
      })
      .pipe(catchError(this.handleError));
  }

  // deleteEmployee(id: number): Observable<Employee> {
  //   return this.http
  //     .delete<Employee>(`${this.employeesUrl}/${id}`)
  //     .pipe(catchError(this.handleError));
  // }
}
