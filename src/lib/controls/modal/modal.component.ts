
import {
    Component, ViewContainerRef, OnInit, AfterViewChecked, QueryList, ElementRef, ContentChildren, Renderer2
} from '@angular/core';
import { ModalService } from '../../services/modalService';
import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'vgr-modal',
    moduleId: module.id,
    templateUrl: './modal.component.html'
})

export class ModalPlaceholderComponent implements AfterViewChecked {
    isOpen: boolean;
    elementId: string;
    title: string;
    modalInitialized: boolean;
    lastFocusedElement: any;
    firstTabStop: any;
    lastTabStop: any;
    focusableElements: any;

    // A list of elements that can recieve focus
    focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';


    @ContentChildren(ButtonComponent, { read: ElementRef }) buttonComponents: QueryList<ElementRef>;
    constructor(
        private modalService: ModalService, private elementRef: ElementRef, private renderer: Renderer2) {

        this.isOpen = false;
        this.modalService.modalOpened$.subscribe(elementId => {
            this.modalInitialized = false;
            this.elementId = elementId;
            this.openModal();
        });

        this.modalService.modalClosed$.subscribe(elementId => {
            this.elementId = elementId;
            this.closeModal();
        });
    }

    ngAfterViewChecked() {
        if (!this.modalInitialized && this.isOpen && this.buttonComponents && this.buttonComponents.length > 0) {
            this.initFocusableElements();
            this.modalInitialized = true;
        }
    }

    initFocusableElements() {
        // Had to put this in a SetTimeout since the QuerySelector returned old objects from the last opened dialog otherwise
        setTimeout(() => {
            const focusableNodes: NodeList = this.elementRef.nativeElement.querySelectorAll(this.focusableElementsString);
            this.focusableElements = Array.from(focusableNodes);


            this.firstTabStop = this.focusableElements[0];
            this.lastTabStop = this.focusableElements[this.focusableElements.length - 1];

            // Set default button if one is defined
            const defaultButton = this.buttonComponents.find(x => x.nativeElement.getAttribute('default') === 'true');
            if (defaultButton) {
                defaultButton.nativeElement.children[0].focus();
            } else {
                this.firstTabStop.focus();
            }
        }, 10);
    }

    private openModal() {
        this.isOpen = true;
        this.renderer.addClass(document.querySelector(`#${this.elementId}`), 'vgr-modal--open');
        this.renderer.addClass(document.body, 'modal--open');
    }

    private closeModal() {
        this.isOpen = false;
        this.renderer.removeClass(document.querySelector(`#${this.elementId}`), 'vgr-modal--open');
        this.renderer.removeClass(document.body, 'modal--open');
    }

    onKeyDown(e: any) {
        if (e.keyCode === 9) {
            // If Shift + Tab
            if (e.shiftKey) {
                // If the current element in focus is the first focusable element within the modal window...
                if (document.activeElement === this.firstTabStop) {
                    e.preventDefault();
                    // ...jump to the last focusable element
                    this.lastTabStop.focus();
                }
                // if Tab
            } else {
                // If the current element in focus is the last focusable element within the modal window...
                if (document.activeElement === this.lastTabStop) {
                    e.preventDefault();
                    // ...jump to the first focusable element
                    this.firstTabStop.focus();
                }
            }
        }
    }


}
