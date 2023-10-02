import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CodeModel } from '@ngstack/code-editor';

@Component({
	selector: 'ngbd-modal-confirm',
	standalone: true,
	templateUrl: 'modal-confirm.html',
})
export class NgbdModalConfirm {
	constructor(public modal: NgbActiveModal) {}
  
}

@Component({
	selector: 'ngbd-modal-ok',
	standalone: true,
	templateUrl: './modal-ok.html',
})
export class NgbdModalOk {
	constructor(public modal: NgbActiveModal) {}
}

@Component({
	selector: 'ngbd-modal-error',
	standalone: true,
	templateUrl: 'modal-error.html',
})
export class NgbdModalError {
	constructor(public modal: NgbActiveModal) {}
}

@Component({
	selector: 'ngbd-modal-input',
	//standalone: true,
	templateUrl: './modal-input.html',
})
export class NgbdModalInput {
	constructor(public modal: NgbActiveModal) {}
	input!: string;
}

@Component({
	selector: 'ngbd-modal-code-editor',
	//standalone: true,
	templateUrl: 'modal-code-editor.html',
})
export class NgbdModalCodeEditor implements OnInit {
	theme = 'vs-dark';

	casesCodeModel: CodeModel = {
		language: 'csv',
		uri: 'main.csv',
		value: ''
	};

	options = {
		contextmenu: true,
		minimap: {
		enabled: false
		}
  };
	constructor(public modal: NgbActiveModal) {}
	@Input() public content: any;
	input!: string;
	ngOnInit(): void {
		var newModel = {
			language: 'csv',
			uri: 'main.csv',
			value: this.content
		};
		this.casesCodeModel = JSON.parse(JSON.stringify(newModel));
	}
}

const MODALS: { [name: string]: any } = {
	confirm: NgbdModalConfirm,
	ok: NgbdModalOk,
	error: NgbdModalError,
	input: NgbdModalInput,
	editor: NgbdModalCodeEditor
};

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(private _modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open(name: string) : any {
		this._modalService.open(MODALS[name]).result.then(
			(result) => {
				return result;
			},
			(reason) => {
				return false;
			},
		);
	}

}
