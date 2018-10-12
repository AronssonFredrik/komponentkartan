import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class ModalService {

    // Observable string sources
    private modalOpenedSource = new Subject<string>();
    private modalClosedSource = new Subject<string>();

    // Observable string streams
    modalOpened$ = this.modalOpenedSource.asObservable();
    modalClosed$ = this.modalClosedSource.asObservable();

    openDialog(elementId: string) {
        this.modalOpenedSource.next(elementId);
    }

    closeDialog(elementId: string) {
        this.modalClosedSource.next(elementId);
    }
}

