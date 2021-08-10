import { Employee } from 'src/app/__services__/user.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface LoginData {
  registration: string;
  passkey: string;
}

export interface LoginResponse {
  accessToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  employeesUrl = 'http://localhost:4000/auth';

  constructor(private http: HttpClient) {}

  handleError(err: HttpErrorResponse) {
    return throwError(err);
  }

  login(loginData: LoginData): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.employeesUrl}/login`, loginData)
      .pipe(catchError(this.handleError));
  }
}
