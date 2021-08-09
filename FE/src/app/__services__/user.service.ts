import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Employee {
  id: number;
  registration: string;
  firstname: string;
  lastname: string;
  position: string;
  phone: string;
  email: string;
  passkey: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  employeesUrl = 'http://localhost:4000/employees';

  constructor(private http: HttpClient) {}

  handleError(err: HttpErrorResponse) {
    return throwError('An error occured. Please try again later.');
  }

  getEmployees(): Observable<Employee[]> {
    return this.http
      .get<Employee[]>(this.employeesUrl)
      .pipe(catchError(this.handleError));
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http
      .post<Employee>(`${this.employeesUrl}`, employee)
      .pipe(catchError(this.handleError));
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    return this.http
      .patch<Employee>(`${this.employeesUrl}/${employee.id}`, employee)
      .pipe(catchError(this.handleError));
  }

  deleteEmployee(id: number): Observable<Employee> {
    return this.http
      .delete<Employee>(`${this.employeesUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }
}
