import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { bff } from 'src/environments/environment';
export interface UserForSharing {
  id: number;
  full_name: string;
  email: string;
}

export interface ShareResult {
  userId: number;
  permission: string;
  isFolder: boolean;
}

export interface ShareRequest {
  test_id?: number;
  folder_id?: number;
  ai_agent_id?: number;
  ai_agent_folder_id?: number;
  user_to_id: number;
  permission_type: string;
}

export interface PermissionModel {


  id: number;
  user_id: number;
  user_full_name: string;
  user_email: string;
  permission: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsersForSharing(testId: number): Observable<UserForSharing[]> {
    const url = bff.protocol + bff.host + bff.getUsersForSharing.replace('{0}', testId.toString());
    return this.http.get<UserForSharing[]>(url).pipe(
      catchError(err => { return throwError(() => err) })
    );
  }

  getUsersForSharingFolder(folderId: number): Observable<UserForSharing[]> {
    const url = bff.protocol + bff.host + bff.getUsersForSharingFolder.replace('{0}', folderId.toString());
    return this.http.get<UserForSharing[]>(url).pipe(
      catchError(err => { return throwError(() => err) })
    );
  }

  getUsersForSharingAiAgent(agentId: number): Observable<UserForSharing[]> {
    const url = bff.protocol + bff.host + bff.getUsersForSharingAiAgent.replace('{0}', agentId.toString());
    return this.http.get<UserForSharing[]>(url).pipe(
      catchError(err => { return throwError(() => err) })
    );
  }

  getUsersForSharingAiAgentFolder(folderId: number): Observable<UserForSharing[]> {
    const url = bff.protocol + bff.host + bff.getUsersForSharingAiAgentFolder.replace('{0}', folderId.toString());
    return this.http.get<UserForSharing[]>(url).pipe(
      catchError(err => { return throwError(() => err) })
    );
  }

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

  shareFolder(folderId: number, userToId: number): Observable<any> {
    const url = bff.protocol + bff.host + bff.shareTest;
    const request: ShareRequest = {
      folder_id: folderId,
      user_to_id: userToId,
      permission_type: 'view'
    };
    return this.http.post<any>(url, request).pipe(
      catchError(err => { return throwError(() => err) })
    );
  }

  shareAiAgent(agentId: number, userToId: number, permissionType: string): Observable<any> {
    const url = bff.protocol + bff.host + bff.shareTest;
    const request: ShareRequest = {
      ai_agent_id: agentId,
      user_to_id: userToId,
      permission_type: permissionType
    };
    return this.http.post<any>(url, request).pipe(
      catchError(err => { return throwError(() => err) })
    );
  }

  shareAiAgentFolder(folderId: number, userToId: number): Observable<any> {
    const url = bff.protocol + bff.host + bff.shareTest;
    const request: ShareRequest = {
      ai_agent_folder_id: folderId,
      user_to_id: userToId,
      permission_type: 'view'
    };
    return this.http.post<any>(url, request).pipe(
      catchError(err => { return throwError(() => err) })
    );
  }

  getTestPermissions(testId: number): Observable<PermissionModel[]> {
    const url = bff.protocol + bff.host + bff.getTestPermissions.replace('{0}', testId.toString());
    return this.http.get<PermissionModel[]>(url).pipe(
      catchError(err => { return throwError(() => err) })
    );
  }

  getFolderPermissions(folderId: number): Observable<PermissionModel[]> {
    const url = bff.protocol + bff.host + bff.getFolderPermissions.replace('{0}', folderId.toString());
    return this.http.get<PermissionModel[]>(url).pipe(
      catchError(err => { return throwError(() => err) })
    );
  }

  getAiAgentPermissions(agentId: number): Observable<PermissionModel[]> {
    const url = bff.protocol + bff.host + bff.getAiAgentPermissions.replace('{0}', agentId.toString());
    return this.http.get<PermissionModel[]>(url).pipe(
      catchError(err => { return throwError(() => err) })
    );
  }

  getAiAgentFolderPermissions(folderId: number): Observable<PermissionModel[]> {
    const url = bff.protocol + bff.host + bff.getAiAgentFolderPermissions.replace('{0}', folderId.toString());
    return this.http.get<PermissionModel[]>(url).pipe(
      catchError(err => { return throwError(() => err) })
    );
  }

  revokePermission(actionId: number): Observable<void> {
    const url = bff.protocol + bff.host + bff.revokePermission.replace('{0}', actionId.toString());
    return this.http.delete<void>(url).pipe(
      catchError(err => { return throwError(() => err) })
    );
  }


}

