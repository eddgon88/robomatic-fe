import { Component, Input, OnInit, OnDestroy, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
	templateUrl: 'modal-web-watcher.html',
	styleUrls: ['./modal.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class NgbdModalWebWatcher implements OnInit, AfterViewInit, OnDestroy {
	constructor(public modal: NgbActiveModal, private sanitizer: DomSanitizer) { }
	@Input() public host: any;
	@Input() public port: any;
	@Input() public sessionId?: string;
	public iframeUrl: SafeResourceUrl | null = null;
	public isCloudViewer: boolean = false;
	public viewMode: 'direct' | 'grid' = 'direct';
	public isConnecting: boolean = true;
	public connectionError: string | null = null;
	public copied: boolean = false;
	public canAccessGridConsole: boolean = false;
	private rfb: RFB | null = null;

	ngOnInit(): void {
		this.checkUserPermissions();
	}

	private checkUserPermissions(): void {
		try {
			const token = sessionStorage.getItem('token');
			if (token) {
				const parts = token.split('.');
				if (parts.length === 3) {
					const payload = JSON.parse(atob(parts[1]));
					if (payload && payload.role) {
						const role = (typeof payload.role === 'string' ? payload.role : payload.role.name || '').toUpperCase();
						this.canAccessGridConsole = role === 'ADMIN' || role === 'ANALYST' || role === 'SUPER_ADMIN' || role === 'SUPER ADMIN';
					}
				}
			}
		} catch (error) {
			console.error('Error checking user role for grid console:', error);
		}
	}

	ngAfterViewInit(): void {
		// Wait for animation and DOM paint
		setTimeout(() => {
			this.initViewer();
		}, 200);
	}

	public copySessionId(): void {
		if (this.sessionId) {
			navigator.clipboard.writeText(this.sessionId);
			this.copied = true;
			setTimeout(() => {
				this.copied = false;
			}, 2000);
		}
	}

	public openInNewTab(): void {
		const cleanHost = (this.host || "robomatic-browserless-80770840815.southamerica-west1.run.app").replace(/^https?:\/\//, '').replace(/\/+$/, '');
		window.open(`https://${cleanHost}/ui/#/sessions`, '_blank');
	}

	public setViewMode(mode: 'direct' | 'grid'): void {
		this.viewMode = mode;
		if (mode === 'direct' && !this.rfb) {
			const cleanHost = (this.host || "robomatic-browserless-80770840815.southamerica-west1.run.app").replace(/^https?:\/\//, '').replace(/\/+$/, '');
			this.connectDirectVnc(cleanHost, this.isCloudViewer);
		}
	}

	private initViewer(): void {
		if (!this.host) {
			this.host = "robomatic-browserless-80770840815.southamerica-west1.run.app";
		}

		const cleanHost = this.host.replace(/^https?:\/\//, '').replace(/\/+$/, '');
		const gridSessionsUrl = `https://${cleanHost}/ui/#/sessions`;
		this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(gridSessionsUrl);

		const isCloud = this.host.includes('.run.app') || this.host.includes('browserless') || this.host.includes('grid');
		this.isCloudViewer = isCloud;

		this.connectDirectVnc(cleanHost, isCloud);
	}

	private connectDirectVnc(cleanHost: string, isCloud: boolean): void {
		this.isConnecting = true;
		this.connectionError = null;

		const element = document.getElementById('webView');
		if (!element) {
			console.error('webView element not found');
			return;
		}

		element.innerHTML = ''; // Clean previous content

		let wsUrl = '';
		if (isCloud && this.sessionId) {
			// Selenium 4 Standalone expone el WebSocket VNC de la sesión en /session/{sessionId}/se/vnc
			wsUrl = `wss://${cleanHost}/session/${this.sessionId}/se/vnc`;
		} else if (isCloud) {
			// Si no hay sessionId específico, fallback a la consola Grid
			this.viewMode = 'grid';
			this.isConnecting = false;
			return;
		} else {
			// Entorno Docker local
			if (window.location.protocol === 'https:') {
				wsUrl = `wss://${this.host}/vnc/${this.port}`;
			} else {
				wsUrl = `ws://${this.host}:${this.port}`;
			}
		}

		try {
			console.log('Connecting RFB to:', wsUrl);
			this.rfb = new RFB(element as HTMLElement, wsUrl, {
				credentials: { password: 'secret' }
			});
			this.rfb.scaleViewport = true;
			this.rfb.background = "#1a1a1a";

			this.rfb.addEventListener('connect', () => {
				console.log('RFB Connected successfully');
				this.isConnecting = false;
				this.connectionError = null;
			});

			this.rfb.addEventListener('credentialsrequired', () => {
				if (this.rfb) {
					this.rfb.sendCredentials({ password: 'secret' });
				}
			});

			this.rfb.addEventListener('disconnect', (e: any) => {
				console.log('RFB Disconnected:', e);
				this.isConnecting = false;
				if (e && e.detail && e.detail.clean === false) {
					this.connectionError = 'Conexión directa cerrada o sesión finalizada.';
				}
			});
		} catch (error) {
			console.error('Error connecting to direct VNC:', error);
			this.isConnecting = false;
			this.connectionError = 'No se pudo conectar directamente al stream VNC.';
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
