import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { BreadcrumbService } from "../../shared/services/breadcrumb.service";
import { Breadcrumb } from "../../shared/models/breadcrumb.model";
import { Router } from "@angular/router";

interface FolderStackItem {
    id: number;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class NavigationTestService {

    folderId!: number;
    private subject = new Subject<any>();
    private folderStack: FolderStackItem[] = [];

    constructor(
        private breadcrumbService: BreadcrumbService,
        private router: Router
    ) { }

    suscribe(onContextChanged: (context: any) => void): Subscription {
        return this.subject.subscribe(onContextChanged);
    }

    reset() {
        this.folderId = 0;
        this.folderStack = [];
        this.updateBreadcrumbs();
        this.subject.next(this.folderId);
    }

    publishFolder(folderId: number, folderName: string = '') {
        if (!folderId) {
            this.reset();
        } else {
            this.folderId = folderId;
            // Check if we are navigating back in the stack
            const existingIndex = this.folderStack.findIndex(f => f.id === folderId);
            if (existingIndex !== -1) {
                // Truncate stack to the existing folder
                this.folderStack = this.folderStack.slice(0, existingIndex + 1);
            } else {
                // Push new folder
                this.folderStack.push({ id: folderId, name: folderName });
            }

            this.updateBreadcrumbs();
            this.subject.next(folderId);
        }
    }

    updateBreadcrumbs() {
        const homeBreadcrumb: Breadcrumb = {
            label: 'Home',
            url: '',
            action: () => {
                this.router.navigate(['/tests/home']);
                this.reset();
            }
        };

        const breadcrumbs: Breadcrumb[] = this.folderStack.map(folder => ({
            label: folder.name,
            url: '', // No URL change, just state change
            action: () => {
                this.router.navigate(['/tests/home']);
                this.publishFolder(folder.id, folder.name);
            }
        }));

        this.breadcrumbService.setBreadcrumbs([homeBreadcrumb, ...breadcrumbs]);
    }
}