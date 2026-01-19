import { Component, Input, OnInit, OnDestroy, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CodeModel } from '@ngstack/code-editor';
import RFB from "@novnc/novnc/core/rfb";

/**
 * Interface para usuario en lista de compartir
 */
export interface UserForSharing {
	id: number;
	full_name: string;
	email: string;
}

/**
 * Interface para request de compartir
 */
export interface ShareResult {
	userId: number;
	permission: string;
	isFolder: boolean;
}

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
export class NgbdModalWebWatcher implements AfterViewInit, OnDestroy {
	constructor(public modal: NgbActiveModal) { }
	@Input() public host: any;
	@Input() public port: any;
	private rfb: RFB | null = null;

	ngAfterViewInit(): void {
		// Wait for animation and DOM paint
		setTimeout(() => {
			this.initVNC();
		}, 200);
	}

	private initVNC(): void {
		const element = document.getElementById('webView');
		if (element) {
			try {
				element.innerHTML = ''; // Clean previous content

				let url = '';
				if (window.location.protocol === 'https:') {
					// Use Nginx proxy for HTTPS (WSS)
					// Format: wss://domain/vnc/port/websockify
					url = `wss://${this.host}/vnc/${this.port}/websockify`;
				} else {
					// Direct connection for HTTP (WS)
					url = `ws://${this.host}:${this.port}/websockify`;
				}

				this.rfb = new RFB(element as HTMLElement, url);
				this.rfb.scaleViewport = false; // Disable scaling to avoid 0px width on large images
				this.rfb.background = "#000000";
			} catch (error) {
				console.error('Error connecting to VNC:', error);
			}
		} else {
			console.error('webView element not found');
		}
	}

	ngOnDestroy(): void {
		if (this.rfb) {
			try {
				this.rfb.disconnect();
			} catch (error) {
				// Ignore disconnect errors
			}
			this.rfb = null;
		}
	}
}

@Component({
	selector: 'ngbd-generic-confirm',
	standalone: true,
	template: `
		<div class="modal-header">
			<h4 class="modal-title">{{ title }}</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="modal.dismiss()"></button>
		</div>
		<div class="modal-body">
			<p>{{ message }}</p>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss()">{{ cancelText }}</button>
			<button type="button" class="btn btn-danger" (click)="modal.close(true)">{{ confirmText }}</button>
		</div>
	`,
	styleUrls: ['./modal.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class NgbdGenericConfirm {
	@Input() title: string = 'Confirm';
	@Input() message: string = '';
	@Input() confirmText: string = 'Confirm';
	@Input() cancelText: string = 'Cancel';
	constructor(public modal: NgbActiveModal) { }
}

@Component({
	selector: 'ngbd-modal-share',
	templateUrl: 'modal-share.html',
	styleUrls: ['./modal.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class NgbdModalShare implements OnInit {
	constructor(public modal: NgbActiveModal) { }

	@Input() public itemId!: number;
	@Input() public itemName: string = '';
	@Input() public users: UserForSharing[] = [];
	@Input() public loadingUsers: boolean = false;
	@Input() public isFolder: boolean = false;

	selectedUserId: number | null = null;
	selectedPermission: string | null = null;
	sharing: boolean = false;

	ngOnInit(): void {
		// Para folders, el permiso es siempre 'view' por defecto
		if (this.isFolder) {
			this.selectedPermission = 'view';
		}
	}

	share(): void {
		// Para folders, siempre usar 'view'. Para tests, usar el permiso seleccionado
		const permission = this.isFolder ? 'view' : this.selectedPermission;

		if (this.selectedUserId && permission) {
			this.sharing = true;
			const result: ShareResult = {
				userId: this.selectedUserId,
				permission: permission,
				isFolder: this.isFolder
			};
			this.modal.close(result);
		}
	}
}

const MODALS: { [name: string]: any } = {
	confirm: NgbdModalConfirm,
	ok: NgbdModalOk,
	error: NgbdModalError,
	input: NgbdModalInput,
	editor: NgbdModalCodeEditor,
	vnc: NgbdModalWebWatcher,
	share: NgbdModalShare,
	genericConfirm: NgbdGenericConfirm
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
