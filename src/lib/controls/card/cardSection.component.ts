import { Component, HostBinding, Input, ElementRef, AfterContentInit } from '@angular/core';

@Component({
    selector: 'vgr-card-section',
    moduleId: module.id,
    templateUrl: './cardSection.component.html'
})
export class CardSectionComponent {

    private expanded_chevron;

    @Input() title: string;
    @Input() subtitle: string;

    @HostBinding('class.card-section') cardSectionClass = true;
    @Input() @HostBinding('class.card-section--readonly') readonly: boolean;
    @HostBinding('class.card-section--expanded') private _expanded: boolean;
    @HostBinding('class.card-section--collapsed')
    get isCollapsed() {
        return !this._expanded;
    }

    @Input() set expanded(expandedValue: boolean) {
        if (expandedValue && !this._expanded) {
            this._expanded = true;
            this.expanded_chevron = true;
        } else if (!expandedValue && this._expanded) {
            this._expanded = false;
            setTimeout(() => {
                this.expanded_chevron = false;
            }, 400);
        }
    }

    get expanded(): boolean {
        return this._expanded;
    }

    get chevron_class() {
        return 'card-section__header__expander  '.concat(this.expanded_chevron ? 'expanded' : 'collapsed');
    }
    constructor(private elementRef: ElementRef) {
        this.readonly = true;
    }
}


