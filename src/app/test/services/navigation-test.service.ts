import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class NavigationTestService {

    folderId!: number;
    private subject = new Subject<any>();

    suscribe(onContextChanged: (context: any) => void): Subscription {
        return this.subject.subscribe(onContextChanged);
    }

    reset() {
        this.folderId = 0;
        this.subject.next(this.folderId);
    }

    publishFolder(folderId: number) {
        if(!folderId) {
            this.reset();
        } else {
            this.subject.next(folderId);
        }
    }

}