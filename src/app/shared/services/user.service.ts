import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { bff } from 'src/environments/environment';
import { UserForSharing } from '../components/modal/modal.component';

/**
 * Interface para la solicitud de compartir test o folder
 * Usa snake_case para coincidir con la configuración del backend
 */
export interface ShareRequest {
  test_id?: number;
  folder_id?: number;
  user_to_id: number;
  permission_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de usuarios disponibles para compartir un test específico
   * Excluye:
   * - Al usuario actual
   * - A los administradores
   * - Al owner del test
   * - A usuarios que ya tienen permisos sobre el test
   * 
   * @param testId ID del test a compartir
   */
  getUsersForSharing(testId: number): Observable<UserForSharing[]> {
    const url = bff.protocol + bff.host + bff.getUsersForSharing.replace('{0}', testId.toString());
    return this.http.get<UserForSharing[]>(url).pipe(
      catchError(err => { return throwError(() => err) })
    );
  }

  /**
   * Obtiene la lista de usuarios disponibles para compartir un folder específico
   * Excluye:
   * - Al usuario actual
   * - A los administradores
   * - Al owner del folder
   * - A usuarios que ya tienen permisos sobre el folder
   * 
   * @param folderId ID del folder a compartir
   */
  getUsersForSharingFolder(folderId: number): Observable<UserForSharing[]> {
    const url = bff.protocol + bff.host + bff.getUsersForSharingFolder.replace('{0}', folderId.toString());
    return this.http.get<UserForSharing[]>(url).pipe(
      catchError(err => { return throwError(() => err) })
    );
  }

  /**
   * Comparte un test con otro usuario
   * @param testId ID del test a compartir
   * @param userToId ID del usuario destinatario
   * @param permissionType Tipo de permiso: 'view', 'execute', 'edit'
   */
  shareTest(testId: number, userToId: number, permissionType: string): Observable<any> {
    const url = bff.protocol + bff.host + bff.shareTest;
    const request: ShareRequest = {
      test_id: testId,
      user_to_id: userToId,
      permission_type: permissionType
    };
    return this.http.post<any>(url, request).pipe(
      catchError(err => { return throwError(() => err) })
    );
  }

  /**
   * Comparte un folder con otro usuario (siempre con permiso 'view')
   * @param folderId ID del folder a compartir
   * @param userToId ID del usuario destinatario
   */
  shareFolder(folderId: number, userToId: number): Observable<any> {
    const url = bff.protocol + bff.host + bff.shareTest;
    const request: ShareRequest = {
      folder_id: folderId,
      user_to_id: userToId,
      permission_type: 'view' // Siempre view para folders
    };
    return this.http.post<any>(url, request).pipe(
      catchError(err => { return throwError(() => err) })
    );
  }

}

