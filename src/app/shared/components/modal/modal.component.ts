// ANTIGRAVITY-FIX-V1
import { Component, Input, OnInit, OnDestroy, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CodeModel } from '@ngstack/code-editor';
import RFB from "@novnc/novnc/core/rfb";
import { UserService, PermissionModel, UserForSharing, ShareResult } from '../../services/user.service';
import { TestService } from '../../../test/services/test.service';


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
	selector: 'ngbd-modal-markdown-viewer',
	templateUrl: 'modal-markdown-viewer.html',
	styleUrls: ['./modal.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class NgbdModalMarkdownViewer implements OnInit {
	@Input() public content: any;
	@Input() public fileName: string = 'Reporte';
	renderedContent: any;

	constructor(public modal: NgbActiveModal) { }

	async ngOnInit(): Promise<void> {
		const { marked } = await import('marked');
		this.renderedContent = await marked.parse(this.content);
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
					// Format: wss://domain/vnc/port
					url = `wss://${this.host}/vnc/${this.port}`;
				} else {
					// Direct connection for HTTP (WS)
					url = `ws://${this.host}:${this.port}`;
				}

				this.rfb = new RFB(element as HTMLElement, url);
				this.rfb.scaleViewport = true; // Enable scaling to fit the modal
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
	constructor(public modal: NgbActiveModal, private userService: UserService) { }

	@Input() public itemId!: number;
	@Input() public itemName: string = '';
	@Input() public users: UserForSharing[] = [];
	@Input() public loadingUsers: boolean = false;
	@Input() public isFolder: boolean = false;

	selectedUserId: number | null = null;
	selectedPermission: string | null = null;
	sharing: boolean = false;

	permissions: PermissionModel[] = [];
	loadingPermissions: boolean = false;

	ngOnInit(): void {
		// Para folders, el permiso es siempre 'view' por defecto
		if (this.isFolder) {
			this.selectedPermission = 'view';
		}
		this.loadPermissions();
	}

	loadPermissions(): void {
		this.loadingPermissions = true;
		if (this.isFolder) {
			this.userService.getFolderPermissions(this.itemId).subscribe({
				next: (perms) => {
					this.permissions = perms;
					this.loadingPermissions = false;
				},
				error: (err) => {
					console.error('Error loading permissions', err);
					this.loadingPermissions = false;
				}
			});
		} else {
			this.userService.getTestPermissions(this.itemId).subscribe({
				next: (perms) => {
					console.log('Received permissions:', perms);
					this.permissions = perms;
					this.loadingPermissions = false;
				},
				error: (err) => {
					console.error('Error loading permissions', err);
					this.loadingPermissions = false;
				}
			});
		}
	}

	revoke(permission: PermissionModel): void {
		if (confirm(`Are you sure you want to remove access for ${permission.user_full_name}?`)) {
			// Optimistic update
			const index = this.permissions.indexOf(permission);
			if (index > -1) {
				const originalPermissions = [...this.permissions];
				this.permissions.splice(index, 1);

				this.userService.revokePermission(permission.id).subscribe({
					next: () => {
						// Success
					},
					error: (err) => {
						console.error('Error revoking permission', err);
						// Revert
						this.permissions = originalPermissions;
						alert('Failed to revoke permission.');
					}
				});
			}
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

@Component({
	selector: 'ngbd-modal-execution-limit',
	templateUrl: 'modal-execution-limit.html',
	styleUrls: ['./modal.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class NgbdModalExecutionLimit implements OnInit {
	@Input() public testId!: number;
	@Input() public itemName: string = '';

	loading: boolean = true;
	saving: boolean = false;
	counterData: any = null;
	newLimit: number = 0;

	selectedMonth!: number;
	selectedYear!: number;
	availableMonths: { value: number, label: string }[] = [];
	
	private monthNames = [
		'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
		'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
	];

	constructor(public modal: NgbActiveModal, private testService: TestService) { }

	ngOnInit(): void {
		const now = new Date();
		this.selectedMonth = now.getMonth() + 1;
		this.selectedYear = now.getFullYear();
		this.initAvailableMonths();
		this.loadData();
	}

	initAvailableMonths(): void {
		const currentMonth = new Date().getMonth(); // 0-indexed
		for (let i = currentMonth; i < 12; i++) {
			this.availableMonths.push({
				value: i + 1,
				label: this.monthNames[i]
			});
		}
	}

	onMonthChange(): void {
		this.loadData();
	}

	loadData(): void {
		this.loading = true;
		this.testService.getExecutionCounter(this.testId, this.selectedYear, this.selectedMonth).subscribe({
			next: (data) => {
				this.counterData = data;
				this.newLimit = data.max_executions;
				this.loading = false;
			},
			error: (err) => {
				console.error('Error loading counter data', err);
				this.loading = false;
			}
		});
	}

	save(): void {
		this.saving = true;
		this.testService.updateExecutionCounter(this.testId, this.newLimit, this.selectedYear, this.selectedMonth).subscribe({
			next: () => {
				this.saving = false;
				this.modal.close(true);
			},
			error: (err) => {
				console.error('Error updating counter limit', err);
				this.saving = false;
				alert('Error al guardar los cambios.');
			}
		});
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
	genericConfirm: NgbdGenericConfirm,
	limit: NgbdModalExecutionLimit,
	markdown: NgbdModalMarkdownViewer
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
