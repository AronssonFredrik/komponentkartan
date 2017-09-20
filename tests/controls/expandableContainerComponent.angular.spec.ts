
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RowNotification } from '../../component-package/models/rowNotification.model';
import { NotificationIcon } from '../../component-package/models/notificationIcon.model';
import { NotificationType } from '../../component-package/models/notificationType.model';

import { ExpandableContainerComponent } from '../../component-package/controls/expandableContainer/expandableContainer.component';
import { ExpandableContainerJqeuryHelper } from '../../component-package/controls/expandableContainer/expandableContainerJqueryHelper';


describe('ExpandableContainerComponent', () => {
    let component: ExpandableContainerComponent;
    let fixture: ComponentFixture<ExpandableContainerComponent>;
    let rootElement: DebugElement;
    let jqueryHelper: ExpandableContainerJqeuryHelper = new ExpandableContainerJqeuryHelper();

    beforeEach((done) => {
        TestBed.resetTestEnvironment();
        TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
        TestBed.configureTestingModule({
            declarations: [ExpandableContainerComponent],
            imports: [CommonModule],
            providers: [{ provide: ExpandableContainerJqeuryHelper, useValue: jqueryHelper }]
        });

        TestBed.overrideComponent(ExpandableContainerComponent, {
            set: {
                templateUrl: './expandableContainer.component.html'
            }
        });

        TestBed.compileComponents().then(() => {
            // spyOn(jqueryHelper, 'collapseContent');
            spyOn(jqueryHelper, 'showNotification');
            spyOn(jqueryHelper, 'toggleContent');
            spyOn(jqueryHelper, 'collapseNotification');
            spyOn(jqueryHelper, 'fadeInNotification');
            fixture = TestBed.createComponent(ExpandableContainerComponent);
            component = fixture.componentInstance;
            rootElement = fixture.debugElement;
            fixture.detectChanges();
            done();
        });
    });

    describe('When initialized, ', () => {
        beforeEach(() => {
            component.ngOnInit();
        });

        it('the component has the expandable-container class', () => {
            expect(rootElement.classes['expandable-container']).toBe(true);
        });
    });

    describe('When initialized with a Permanent notification is set,', () => {
        beforeEach(() => {
            component.notification = { message: 'Information', icon: NotificationIcon.Ok, type: NotificationType.Permanent } as RowNotification;
            component.ngOnInit();

        });
        it('notification is displayed', () => {
            expect(jqueryHelper.showNotification).toHaveBeenCalled();
        })

    });


    describe('When row is expanded', () => {
        beforeEach(() => {
            component.expanded = true;
            fixture.detectChanges();
        });
        beforeAll(() => {
            jasmine.clock().uninstall();
            jasmine.clock().install();
        });
        afterAll(() => {
            jasmine.clock().uninstall();
        })

        it('the components property expanded is set to true', () => {
            expect(component.expanded).toBe(true);
        });
        it('toggleContent is called', () => {
            expect(jqueryHelper.toggleContent).toHaveBeenCalled();
        });

        describe('and a ShowOnCollapse notification is set', () => {
            beforeEach(() => {
                component.notification = { message: 'Row saved', icon: NotificationIcon.Ok, type: NotificationType.ShowOnCollapse } as RowNotification;
            });
            it('expanded is set to false', () => {
                expect(component.expanded).toBe(false);
            });
            it('collapse is set to true', () => {
                expect(component.collapsed).toBe(true);
            });
            it('notification is displayed', () => {
                expect(jqueryHelper.fadeInNotification).toHaveBeenCalled();
            })
            describe('after 1,9 seconds', () => {
                beforeEach(() => {
                    jasmine.clock().tick(1900);
                    fixture.detectChanges();
                });
                it('the notification is hidden', () => {
                    expect(jqueryHelper.collapseNotification).toHaveBeenCalled();
                });
                it('the notification event is done', () => {
                    expect(component.notification.done).toBe(true);
                });
            });
        });
        describe('and a ShowOnRemove notification is set', () => {
            beforeEach(() => {
                component.notification = { message: 'Row deleted', icon: NotificationIcon.Ok, type: NotificationType.ShowOnRemove } as RowNotification;
                fixture.detectChanges();
            });
            it('expanded is set to false', () => {
                expect(component.expanded).toBe(false);
            });
            it('collapse is set to true', () => {
                expect(component.collapsed).toBe(true);
            });
            it('deleted is set to true', () => {
                expect(component.deleted).toBe(true);
            });
            it('class deleted is set', () => {
                expect(rootElement.classes['expandable-container--deleted']).toBe(true);
            });
        });


    });

    describe('When initialized with a permanent notification, ', () => {
        beforeEach(() => {
            component.notification = { message: 'Information', icon: NotificationIcon.Ok, type: NotificationType.Permanent } as RowNotification;
            component.ngOnInit();
        });
        it('notification is displayed', () => {
            expect(jqueryHelper.showNotification).toHaveBeenCalled();
        })
    });
});

