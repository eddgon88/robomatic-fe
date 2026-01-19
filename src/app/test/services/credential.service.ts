import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { bff } from 'src/environments/environment';
import { CreateCredentialRequest, CredentialModel, UpdateCredentialRequest } from '../models/credential-model';

@Injectable({
  providedIn: 'root'
})
export class CredentialService {

  constructor(private http: HttpClient) { }

  getByTestId(testId: number): Observable<CredentialModel[]> {
    const url = bff.protocol + bff.host + bff.getCredentials.replace('{0}', testId + '');
    return this.http.get<CredentialModel[]>(url).pipe(
      catchError(err => { return throwError(err); })
    );
  }

  create(credential: CreateCredentialRequest): Observable<CredentialModel> {
    const url = bff.protocol + bff.host + bff.createCredential;
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<CredentialModel>(url, credential, { headers: headers }).pipe(
      catchError(err => { return throwError(err); })
    );
  }

  update(credential: UpdateCredentialRequest): Observable<CredentialModel> {
    const url = bff.protocol + bff.host + bff.updateCredential;
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.put<CredentialModel>(url, credential, { headers: headers }).pipe(
      catchError(err => { return throwError(err); })
    );
  }

  delete(credentialId: number): Observable<void> {
    const url = bff.protocol + bff.host + bff.deleteCredential.replace('{0}', credentialId + '');
    return this.http.delete<void>(url).pipe(
      catchError(err => { return throwError(err); })
    );
  }

}


