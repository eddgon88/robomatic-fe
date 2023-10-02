import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { bff } from 'src/environments/environment';
import { TestRecord } from '../interfaces/test-record';
import { Folder } from '../interfaces/folder';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  constructor(private http: HttpClient) { }

  create(name: string, folderId: number): Observable<TestRecord>{
    const url = bff.protocol + bff.host + bff.createFolder;
    let request = {
      name: name,
      folder_id: folderId
    };
    return this.http.post<TestRecord>(url, request).pipe(
      catchError(err => {return throwError(err);})
    )
  }

  delete(folderId: number): Observable<Folder>{
    const url = bff.protocol + bff.host + bff.deleteFolder.replace('{0}', folderId+'');
    let request = {};
    return this.http.post<Folder>(url, request).pipe(
      catchError(err => {return throwError(err);})
    )
  }
}
