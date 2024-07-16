import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, catchError, throwError } from 'rxjs';
import { bff } from 'src/environments/environment';
import { SingUpRequestModel } from '../models/sing-up-request-model';
import { ConfirmUser } from '../interfaces/confirm-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public jwtHelper: JwtHelperService,
                private http: HttpClient) {}

  public isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  login(username: string, password: string): Observable<any>{
    const url = bff.protocol + bff.host + bff.login;
    let request = {
        email: username,
        pass: password
    };
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa("username:password")
      }),
      observe: 'response' as 'body'
    };
    return this.http.post<any>(url, request, httpOptions).pipe(
      catchError(err => {return throwError(err);})
    )
  }

  singup(request: SingUpRequestModel): Observable<any>{
    const url = bff.protocol + bff.host + bff.singup;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa("username:password")
      }),
      observe: 'response' as 'body'
    };
    return this.http.post<any>(url, request, httpOptions).pipe(
      catchError(err => {return throwError(err);})
    )
  }

  confirmUser(token: string): Observable<ConfirmUser>{
    const url = bff.protocol + bff.host + bff.confirmUser.replace('{0}', token);
    return this.http.get<ConfirmUser>(url).pipe(
      catchError(err => {return throwError(err)})
    )
  }

}
