import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { bff } from 'src/environments/environment';
import { FileEvidence } from '../interfaces/file-evidence';
import { TestExecutionRecord } from '../interfaces/test-execution-record';

@Injectable({
  providedIn: 'root'
})
export class TestExecutionService {

  constructor(private http: HttpClient) { }

  getRecordList(testId: number): Observable<TestExecutionRecord[]>{
    const url = bff.protocol + bff.host + bff.getExecutionRecords.replace('{0}', testId+'');
    return this.http.get<TestExecutionRecord[]>(url).pipe(
      catchError(err => {return throwError(err)})
    )
  }

  getFileList(executionId: string): Observable<FileEvidence[]>{
    const url = bff.protocol + bff.host + bff.getFileEvidences.replace('{0}', executionId);
    return this.http.get<FileEvidence[]>(url).pipe(
      catchError(err => {return throwError(err)})
    )
  }

  getFileNames(executionId: string): Observable<FileEvidence[]> {
    const url = bff.protocol + bff.host + bff.getFileEvidenceNames.replace('{0}', executionId);
    return this.http.get<FileEvidence[]>(url).pipe(
      catchError(err => throwError(err))
    );
  }

  getFileContent(executionId: string, fileName: string): Observable<FileEvidence> {
    const url = bff.protocol + bff.host + bff.getFileEvidenceContent
      .replace('{0}', executionId)
      .replace('{1}', fileName);
    return this.http.get<FileEvidence>(url).pipe(
      catchError(err => throwError(err))
    );
  }

  downloadAllEvidences(executionId: string): Observable<Blob> {
    const url = bff.protocol + bff.host + bff.downloadAllEvidences.replace('{0}', executionId);
    return this.http.get(url, { responseType: 'blob' }).pipe(
      catchError(err => throwError(err))
    );
  }

}
