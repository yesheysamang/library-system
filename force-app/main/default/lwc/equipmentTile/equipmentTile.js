import { LightningElement, api, track } from 'lwc';

export default class EquipmentTile extends LightningElement {
    /** Whether the tile is draggable. */
    @api draggable;

    _equipment;
    /** Equipment_c to display. */
    @api
    get equipment() {
        return this._equipment;
    }
    set equipment(value) {
        this._equipment = value;
        this.pictureUrl = value.Picture_URL__c;
        this.name = value.Name;
        this.type = value.Equipment_Type__c;
    }

    /** Equipment_c field values to display. */
    @track pictureUrl;
    @track name;
    @track type;

    handleClick() {
        const selectedEvent = new CustomEvent('selected', {
            detail: this.equipment.Id
        });
        this.dispatchEvent(selectedEvent);
    }

    handleDragStart(event) {
        event.dataTransfer.setData('equipment', JSON.stringify(this.equipment));
    }
}