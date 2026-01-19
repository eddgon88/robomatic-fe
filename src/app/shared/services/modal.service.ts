import { Injectable } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalConfirm, NgbdModalInput, NgbdModalCodeEditor, NgbdModalWebWatcher, NgbdModalShare, UserForSharing, ShareResult, NgbdGenericConfirm } from '../components/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private _modalService: NgbModal) { }

  async modalConfirm(type: 'folder' | 'test', name: string): Promise<any> {
    return await new Promise(resolve => {
      const modalRef = this._modalService.open(NgbdModalConfirm);
      modalRef.componentInstance.type = type;
      modalRef.componentInstance.name = name;
      modalRef.result.then(
        (result) => {
          resolve(result);
        },
        (reason) => {
          resolve(false);
        },
      );
    })
  }

  /**
   * Modal de confirmación genérico
   */
  async confirm(title: string, message: string, confirmText: string = 'Confirm', cancelText: string = 'Cancel'): Promise<boolean> {
    return await new Promise(resolve => {
      const modalRef = this._modalService.open(NgbdGenericConfirm);
      modalRef.componentInstance.title = title;
      modalRef.componentInstance.message = message;
      modalRef.componentInstance.confirmText = confirmText;
      modalRef.componentInstance.cancelText = cancelText;
      modalRef.result.then(
        (result) => {
          resolve(result === true);
        },
        (reason) => {
          resolve(false);
        },
      );
    });
  }

  async modalInput(mesagge: string): Promise<any> {
    return await new Promise(resolve => {
      this._modalService.open(NgbdModalInput).result.then(
        (result) => {
          resolve(result);
        },
        (reason) => {
          resolve(false);
        },
      );
    })
  }

  async modalCodeeditor(mesagge: string): Promise<any> {

    const modalRef = this._modalService.open(NgbdModalCodeEditor);
    modalRef.componentInstance.content = mesagge;

  }

  async modalWebWatcher(host: string, port: string): Promise<any> {

    let modalOptions: NgbModalOptions = {
      size: 'xl',
      fullscreen: 'lg',
      scrollable: true
    };

    const modalRef = this._modalService.open(NgbdModalWebWatcher, modalOptions);
    modalRef.componentInstance.host = host;
    modalRef.componentInstance.port = port;

  }

  /**
   * Abre el modal para compartir un test o folder
   * @param itemId ID del test o folder a compartir
   * @param itemName Nombre del test o folder
   * @param users Lista de usuarios disponibles
   * @param loadingUsers Indica si se están cargando los usuarios
   * @param isFolder Indica si es un folder (true) o un test (false)
   * @returns Promise con el resultado de la selección (userId y permission) o false si se cancela
   */
  async modalShare(itemId: number, itemName: string, users: UserForSharing[], loadingUsers: boolean = false, isFolder: boolean = false): Promise<ShareResult | false> {
    return await new Promise(resolve => {
      const modalRef = this._modalService.open(NgbdModalShare);
      modalRef.componentInstance.itemId = itemId;
      modalRef.componentInstance.itemName = itemName;
      modalRef.componentInstance.users = users;
      modalRef.componentInstance.loadingUsers = loadingUsers;
      modalRef.componentInstance.isFolder = isFolder;
      modalRef.result.then(
        (result: ShareResult) => {
          resolve(result);
        },
        (reason) => {
          resolve(false);
        },
      );
    });
  }

}
