import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TestRecord } from '../interfaces/test-record';
import { catchError, Observable, throwError } from 'rxjs';
import { bff } from 'src/environments/environment';
import { TestExecution } from '../interfaces/test-execution';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient) { }

  getRecordList(folder: number): Observable<TestRecord[]>{
    const url = bff.protocol + bff.host + bff.getRecords.replace('{0}', folder+'');
    return this.http.get<TestRecord[]>(url).pipe(
      catchError(err => {return throwError(err)})
    )
  }

  execute(testId: number): Observable<TestExecution>{
    const url = bff.protocol + bff.host + bff.execute.replace('{0}', testId+'');
    let request = {};
    return this.http.post<TestExecution>(url, request).pipe(
      catchError(err => {return throwError(err);})
    )
  }

}
