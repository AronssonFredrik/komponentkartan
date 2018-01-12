import { Component, AfterViewInit, EventEmitter, Output } from '@angular/core';
import {
    IDropdownItem, ISelectableItem, ModalService,
    ModalButtonConfiguration, IHeaderMenu,
    IHeaderMenuItem, NotificationType, NotificationIcon
} from '../../lib/index';

// 3rd Party
import * as $ from 'jquery';

@Component({
    moduleId: module.id,
    selector: 'vgr-komponentkarta',
    templateUrl: 'komponentkarta.component.html'
})
export class KomponentkartaComponent implements AfterViewInit {
    // Enum declarations
    public NotificationTypes = NotificationType;
    public NotificationIcons = NotificationIcon;

    maxDate: Date = new Date(2018, 7, 1);

    selectedThemeOption: ISelectableItem;
    themeOptions: ISelectableItem[];
    dropDownItems25: IDropdownItem[];
    dropDownItems200: IDropdownItem[];
    dropDownItems9: IDropdownItem[];
    dropDownItems6: IDropdownItem[];
    dropDownItems7: IDropdownItem[];
    dropDownItems4: IDropdownItem[];
    dropMultipleDownItems8: IDropdownItem[];
    dropDownItems10: IDropdownItem[];
    dropDownItems25All: IDropdownItem[];
    buttonDisabled: boolean;
    buttonSecondaryDisabled: boolean;
    selectedRadioOption: ISelectableItem;
    saveCancelMessage: string;
    lockMessage: string;
    actionPanelMessage: string;
    actionInProgress: boolean;
    headerMenu: IHeaderMenu;
    lastModalAnswer: string;
    lastMultipleSelection: string;
    lastSingleSelection: string;
    expanded: boolean;
    isReadonlyAndDisabled: boolean;
    isReadonlyAndDisabledMulti: boolean;
    constructor(private modalService: ModalService) {
        this.isReadonlyAndDisabled = true;
        this.isReadonlyAndDisabledMulti = true;
        this.dropDownItems25 = this.getDemoItems(25);
        this.dropDownItems200 = this.getDemoItems(200);
        this.dropDownItems4 = this.getDemoItems(4);
        this.dropDownItems7 = this.getDemoItems(7);
        this.dropDownItems6 = this.getDemoItems(6);
        this.dropMultipleDownItems8 = this.getDemoItems(8);
        this.dropDownItems9 = this.getDemoItems(9);
        this.dropDownItems10 = this.getDemoItems(10);
        this.buttonDisabled = true;
        this.buttonSecondaryDisabled = true;
        this.saveCancelMessage = 'Ingen';
        this.lockMessage = 'Ingen';
        this.actionPanelMessage = '';
        this.themeOptions = [
            { id: 'neutral', displayName: 'Neutral (grå)' } as ISelectableItem,
            { id: 'blue', displayName: 'BMM (blå)' } as ISelectableItem,
            { id: 'red', displayName: 'VGPV (röd)' } as ISelectableItem,
            { id: 'green', displayName: 'Rehab (grön)' } as ISelectableItem,
        ] as ISelectableItem[];
        this.selectedThemeOption = this.themeOptions[0];
        this.selectedRadioOption = { displayName: 'Inget' } as ISelectableItem;
        this.actionInProgress = false;
        this.headerMenu = {
            menuItems: [
                { displayName: 'Test' } as IHeaderMenuItem] as IHeaderMenuItem[]
        } as IHeaderMenu;

        // Lägg til med fördröjning för att återskapa problem vi haft med laddning från service

        // setTimeout(() => {
        //     this.dropDownItems25All = this.getDemoItems(25);
        //     this.dropDownItems25All[1].selected = true;

        // }, 1000);

        this.dropDownItems25All = this.getDemoItems(25);
        this.dropDownItems25All[1].selected = true;

        this.lastMultipleSelection = 'Inget';
        this.lastSingleSelection = 'Inget';

        this.dropDownItems200[3].selected = true;

        this.dropMultipleDownItems8[0].selected = true;
        this.dropMultipleDownItems8[1].selected = true;
        this.dropMultipleDownItems8[2].selected = true;

        this.dropDownItems9[7].selected = true;
    }

    showOneButtonModal() {
        this.modalService.openDialog('Detta är en dialog med en knapp', 'Här kan du bara välja ett alternativ',
            new ModalButtonConfiguration('OK', () => this.lastModalAnswer = 'OK')
        );
    }

    onLock1Changed(locked: boolean) {
        this.lockMessage = 'Lås 1 ' + (locked ? 'låst' : 'upplåst');
    }

    onLock2Changed(locked: boolean) {
        this.lockMessage = 'Lås 2 ' + (locked ? 'låst' : 'upplåst');
    }


    showTwoButtonModal() {
        this.modalService.openDialog('Acceptera villkor',
            'Denna fil innehåller personnummer på de personer som valt er vårdcentral tom 2017-01-31. ' +
            'För nedladdning av filen gäller följande villkor' +
            '1. Innehållet i filen får inte behandlas i strid med personuppgiftslagen (PuL) och patient-datalagen (PdL). ' +
            'Informationen får därför inte användas för annat ändamål än det för vilket uppgifterna samlats in ' +
            '(9 § punkt c och d PuL och 2 kap. 4 § PdL). ' +
            'Detta innebär bland annat att uppgifterna inte får användas för massutskick eller marknadsföring. ' +
            '2. Verksamhetschefen ansvarar för att endast den senaste månadens fil används för eventuell bearbetning av informationen. ' +
            'För att acceptera båda villkoren ovan, tryck [Jag accepterar] annars tryck [Avbryt]' +
            'Notera att systemet bokför vem som accepterat villkoren och tidpunkten för detta.' +
            'Notera även att alla register i verksamheten ska vara anmälda till utsett personuppgiftsombud eller Datainspektionen.',
            new ModalButtonConfiguration('Jag accepterar', () => this.lastModalAnswer = 'Jag accepterar'),
            new ModalButtonConfiguration('Avbryt', () => this.lastModalAnswer = 'Avbryt'),
        );
    }


    showThreeButtonModal() {
        this.modalService.openDialog('Vill du spara innan du stänger?', 'Ändringarna går förlorade om du inte sparar dem',
            new ModalButtonConfiguration('Ja', () => this.lastModalAnswer = 'Ja'),
            new ModalButtonConfiguration('Nej', () => this.lastModalAnswer = 'Nej'),
            new ModalButtonConfiguration('Avbryt', () => this.lastModalAnswer = 'Avbryt')
        );
    }

    showSaveDontSaveCancelModal() {
        this.modalService.openSaveDontSaveCancelDialog('Vill du spara innan du stänger?', 'Ändringarna går förlorade om du inte sparar.',
            () => this.lastModalAnswer = 'Sparade', () => this.lastModalAnswer = 'Sparade inte', () => this.lastModalAnswer = 'Avbröt');
    }

    selectedThemeChanged(selectedTheme: ISelectableItem) {

        const themeClass = 'theme--' + selectedTheme.id;
        document.getElementById('theme-root').classList.remove('theme--neutral');
        document.getElementById('theme-root').classList.remove('theme--blue');
        document.getElementById('theme-root').classList.remove('theme--red');
        document.getElementById('theme-root').classList.remove('theme--green');
        document.getElementById('theme-root').classList.add(themeClass);

    }

    private getDemoItems(numberOfItems: number): IDropdownItem[] {
        const items: IDropdownItem[] = [];
        for (let i = 1; i <= numberOfItems; i++) {
            items.push({ id: i.toString(), displayName: `${i} - Södra hälso- och sjukvårdsnämnd`, displayNameWhenSelected: `Alt ${i}` } as IDropdownItem);
        }
        return items;
    }

    onSelectedRadioOptionChanged(option: ISelectableItem) {
        this.selectedRadioOption = option;
    }
    consoleLog(logText: string) {
    }

    ngAfterViewInit() {
        $('.with-classes').each((item: number, e: Element) => {
            const classes = e.classList;
            let classDescription = '';
            for (let i = 0; i < classes.length; i++) {
                if (classes[i] !== 'with-classes' && classes[i] !== 'flex-pull-right') {
                    classDescription += `.${classes[i]} `;
                }
            }

            (e as HTMLElement).title = classDescription;
            (e as HTMLElement).innerHTML += `<div class='class-description'>${classDescription}</div>`;
        });
    }

    toggleClasses() {
        $('.class-description').fadeToggle();
    }

    onMultipleSelectionChanged(selectedItems: IDropdownItem[]) {
        this.lastMultipleSelection = selectedItems.map(x => x.displayName).join(',');
    }

    onSingleSelectionChanged(selectedItem: IDropdownItem) {
        this.lastSingleSelection = selectedItem.displayName;
    }


}