import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CodeModel } from '@ngstack/code-editor';
import RFB from "@novnc/novnc/core/rfb";

@Component({
	selector: 'ngbd-modal-confirm',
	standalone: true,
	templateUrl: 'modal-confirm.html',
	styleUrls: ['./modal.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class NgbdModalConfirm {
	@Input() type: 'folder' | 'test' = 'folder';
	@Input() name: string = '';
	constructor(public modal: NgbActiveModal) { }
}

@Component({
	selector: 'ngbd-modal-ok',
	standalone: true,
	templateUrl: './modal-ok.html',
	styleUrls: ['./modal.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class NgbdModalOk {
	constructor(public modal: NgbActiveModal) { }
}

@Component({
	selector: 'ngbd-modal-error',
	standalone: true,
	templateUrl: 'modal-error.html',
	styleUrls: ['./modal.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class NgbdModalError {
	constructor(public modal: NgbActiveModal) { }
}

@Component({
	selector: 'ngbd-modal-input',
	//standalone: true,
	templateUrl: './modal-input.html',
	styleUrls: ['./modal.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class NgbdModalInput {
	constructor(public modal: NgbActiveModal) { }
	input!: string;
}

@Component({
	selector: 'ngbd-modal-code-editor',
	//standalone: true,
	templateUrl: 'modal-code-editor.html',
	styleUrls: ['./modal.component.css'],
	encapsulation: ViewEncapsulation.None
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
	constructor(public modal: NgbActiveModal) { }
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

@Component({
	selector: 'ngbd-modal-web-watcher',
	//standalone: true,
	templateUrl: 'modal-web-watcher.html',
	styleUrls: ['./modal.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class NgbdModalWebWatcher implements OnInit {
	constructor(public modal: NgbActiveModal) { }
	@Input() public host: any;
	@Input() public port: any;
	input!: string;
	ngOnInit(): void {
		let element = document.getElementById('webView');
		console.log(element);
		const rfb = new RFB(<HTMLScriptElement>element, 'ws://' + this.host + ':' + this.port + "/websockify");
		let elementafter = document.getElementById('webView');
		console.log(elementafter);
	}
}

const MODALS: { [name: string]: any } = {
	confirm: NgbdModalConfirm,
	ok: NgbdModalOk,
	error: NgbdModalError,
	input: NgbdModalInput,
	editor: NgbdModalCodeEditor,
	vnc: NgbdModalWebWatcher
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

	open(name: string, data?: any): any {
		const modalRef = this._modalService.open(MODALS[name]);
		if (data) {
			for (const key in data) {
				if (Object.prototype.hasOwnProperty.call(data, key)) {
					modalRef.componentInstance[key] = data[key];
				}
			}
		}
		modalRef.result.then(
			(result) => {
				return result;
			},
			(reason) => {
				return false;
			},
		);
	}

}
