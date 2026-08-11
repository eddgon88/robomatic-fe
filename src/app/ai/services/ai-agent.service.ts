import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { bff } from 'src/environments/environment';
import { TestRecord } from '../../test/interfaces/test-record';

export interface AiAgent {
  id?: number;
  name: string;
  role: string;
  goal: string;
  backstory: string;
  llm: string;
  company: string;
  max_iterations: number;
  verbose: boolean;
  temperature: number;
  folder_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AiAgentService {

  constructor(private http: HttpClient) { }

  getAgentList(folder: number): Observable<TestRecord[]>{
    const url = bff.protocol + bff.host + bff.getAiAgents.replace('{0}', folder+'');
    return this.http.get<TestRecord[]>(url).pipe(
      catchError(err => {return throwError(err)})
    )
  }

  getAvailableAgents(): Observable<AiAgent[]> {
    const url = bff.protocol + bff.host + bff.getAvailableAiAgents;
    return this.http.get<AiAgent[]>(url).pipe(
      catchError(err => {return throwError(err);})
    )
  }

  getAgent(id: number): Observable<AiAgent> {
    const url = bff.protocol + bff.host + bff.getAiAgent.replace('{0}', id+"");
    return this.http.get<AiAgent>(url).pipe(
      catchError(err => {return throwError(err);})
    )
  }

  create(agent: AiAgent): Observable<AiAgent>{
    const url = bff.protocol + bff.host + bff.createAiAgent;
    return this.http.post<AiAgent>(url, agent).pipe(
      catchError(err => {return throwError(err);})
    )
  }

  update(agent: AiAgent): Observable<AiAgent>{
    const url = bff.protocol + bff.host + bff.updateAiAgent;
    return this.http.post<AiAgent>(url, agent).pipe(
      catchError(err => {return throwError(err);})
    )
  }

  delete(id: number): Observable<any>{
    const url = bff.protocol + bff.host + bff.deleteAiAgent.replace('{0}', id+'');
    return this.http.post<any>(url, {}).pipe(
      catchError(err => {return throwError(err);})
    )
  }

  createFolder(name: string, folder_id?: number): Observable<any> {
    const url = bff.protocol + bff.host + bff.createAiAgentFolder;
    return this.http.post<any>(url, { name, folder_id }).pipe(
      catchError(err => {return throwError(err);})
    )
  }

  deleteFolder(id: number): Observable<any> {
    const url = bff.protocol + bff.host + bff.deleteAiAgentFolder.replace('{0}', id+'');
    return this.http.post<any>(url, {}).pipe(
      catchError(err => {return throwError(err);})
    )
  }
}
