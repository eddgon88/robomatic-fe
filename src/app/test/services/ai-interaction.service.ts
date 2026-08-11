import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { bff } from 'src/environments/environment';
import { AiInteraction } from '../interfaces/ai-interaction';

@Injectable({
  providedIn: 'root'
})
export class AiInteractionService {

  constructor(private http: HttpClient) { }

  getByExecutionId(executionId: string): Observable<AiInteraction[]> {
    const url = bff.protocol + bff.host + bff.getAiInteractions.replace('{0}', executionId);
    return this.http.get<AiInteraction[]>(url).pipe(
      catchError(err => throwError(() => err))
    );
  }
}
