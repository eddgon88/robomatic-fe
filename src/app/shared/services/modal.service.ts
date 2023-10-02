import { Injectable } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalConfirm, NgbdModalInput, NgbdModalCodeEditor } from '../components/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private _modalService: NgbModal) { }

  async modalConfirm(mesagge: string): Promise<any> {
   return await new Promise(resolve => {
    this._modalService.open(NgbdModalConfirm).result.then(
      (result) => {
        resolve(result);
      },
      (reason) => {
        resolve(false);
      },
    );
   })
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

}
