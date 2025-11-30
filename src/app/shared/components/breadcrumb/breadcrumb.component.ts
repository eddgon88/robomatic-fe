import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { Breadcrumb } from '../../models/breadcrumb.model';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
    staticBreadcrumbs: Breadcrumb[] = [];
    dynamicBreadcrumbs: Breadcrumb[] = [];
    breadcrumbs: Breadcrumb[] = [];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private breadcrumbService: BreadcrumbService
    ) { }

    ngOnInit(): void {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.staticBreadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
                this.updateBreadcrumbs();
            });

        // Initial load
        this.staticBreadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);

        this.breadcrumbService.breadcrumbs$.subscribe(breadcrumbs => {
            this.dynamicBreadcrumbs = breadcrumbs;
            this.updateBreadcrumbs();
        });

        this.updateBreadcrumbs();
    }

    private updateBreadcrumbs() {
        this.breadcrumbs = [...this.staticBreadcrumbs, ...this.dynamicBreadcrumbs];
    }

    private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
        const children: ActivatedRoute[] = route.children;

        if (children.length === 0) {
            return breadcrumbs;
        }

        for (const child of children) {
            const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
            if (routeURL !== '') {
                url += `/${routeURL}`;
            }

            const label = child.snapshot.data['breadcrumb'];
            if (label) {
                breadcrumbs.push({ label, url });
            }

            return this.createBreadcrumbs(child, url, breadcrumbs);
        }

        return breadcrumbs;
    }
}
