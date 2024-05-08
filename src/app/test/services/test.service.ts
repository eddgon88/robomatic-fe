import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TestRecord } from '../interfaces/test-record';
import { catchError, Observable, throwError } from 'rxjs';
import { bff } from 'src/environments/environment';
import { TestExecution } from '../interfaces/test-execution';
import { Test } from '../interfaces/test';
import { TestModel } from '../models/test-model';
import { ExecutionPorts } from '../interfaces/execution-ports';

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

  stop(testId: number): Observable<TestExecution>{
    const url = bff.protocol + bff.host + bff.stop.replace('{0}', testId+'');
    let request = {};
    return this.http.post<TestExecution>(url, request).pipe(
      catchError(err => {return throwError(err);})
    )
  }

  delete(testId: number): Observable<TestExecution>{
    const url = bff.protocol + bff.host + bff.delete.replace('{0}', testId+'');
    let request = {};
    return this.http.post<TestExecution>(url, request).pipe(
      catchError(err => {return throwError(err);})
    )
  }

  create(test: Test): Observable<any>{
    const url = bff.protocol + bff.host + bff.createTest;
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<any>(url, test, {headers: headers}).pipe(
      catchError(err => {return throwError(err);})
    )
  }

  getTest(testId: number): Observable<TestModel> {
    const url = bff.protocol + bff.host + bff.getTest.replace('{0}', testId+"");
    return this.http.get<TestModel>(url).pipe(
      catchError(err => {return throwError(err);})
    )
  }

  update(test: Test): Observable<any>{
    const url = bff.protocol + bff.host + bff.updateTest;
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<any>(url, test, {headers: headers}).pipe(
      catchError(err => {return throwError(err);})
    )
  }

  getExecutionPorts(testId: number): Observable<ExecutionPorts>{
    const url = bff.protocol + bff.host + bff.getPorts.replace('{0}', testId+'');
    return this.http.get<ExecutionPorts>(url).pipe(
      catchError(err => {return throwError(err)})
    )
  }

}
