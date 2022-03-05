import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class ToggleService {

    private searchToggleState = new BehaviorSubject(false);
    public searchToggleState$ = this.searchToggleState.asObservable();

    private addCommentToggleState = new BehaviorSubject(false);
    public addCommentToggleState$ = this.addCommentToggleState.asObservable();

    changeSearchToggle(value: boolean) {
        this.searchToggleState.next(value);
    }

    addCommentToggle(value: boolean) {
        this.addCommentToggleState.next(value);
    }
}
