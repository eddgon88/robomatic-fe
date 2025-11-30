import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Breadcrumb } from '../models/breadcrumb.model';

@Injectable({
    providedIn: 'root'
})
export class BreadcrumbService {
    private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
    breadcrumbs$ = this.breadcrumbsSubject.asObservable();

    setBreadcrumbs(breadcrumbs: Breadcrumb[]) {
        this.breadcrumbsSubject.next(breadcrumbs);
    }

    addBreadcrumb(breadcrumb: Breadcrumb) {
        const current = this.breadcrumbsSubject.value;
        this.breadcrumbsSubject.next([...current, breadcrumb]);
    }

    clear() {
        this.breadcrumbsSubject.next([]);
    }
}
