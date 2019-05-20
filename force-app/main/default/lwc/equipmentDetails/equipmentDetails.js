import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';

/** Wire adapter to load records, utils to extract values. */
import { getRecord } from 'lightning/uiRecordApi';

/** Pub-sub mechanism for sibling component communication. */
import { registerListener, unregisterAllListeners } from 'c/pubsub';

/** Audio_Visual_Equipment__c Schema. */
import EQUIPMENT_OBJECT from '@salesforce/schema/Audio_Visual_Equipment__c';
import NAME_FIELD from '@salesforce/schema/Audio_Visual_Equipment__c.Name';
import STATUS_FIELD from '@salesforce/schema/Audio_Visual_Equipment__c.Equipment_Status__c';
import CATEGORY_FIELD from '@salesforce/schema/Audio_Visual_Equipment__c.Equipment_Type__c';
import DATE_LAST_BORROWED_FIELD from '@salesforce/schema/Audio_Visual_Equipment__c.Date_Last_Borrowed__c';
import EQUIPMENT_BRAND_FIELD from '@salesforce/schema/Audio_Visual_Equipment__c.Equipment_Brand__c';
import PICTURE_URL_FIELD from '@salesforce/schema/Audio_Visual_Equipment__c.Picture_URL__c';

/** Record fields to load. */
const fields = [
    NAME_FIELD,
    STATUS_FIELD,
    CATEGORY_FIELD,
    DATE_LAST_BORROWED_FIELD,
    EQUIPMENT_BRAND_FIELD,
    PICTURE_URL_FIELD
];

/**
 * Component to display details of a Audio_Visual_Equipment__c.
 */
export default class EquipmentDetails extends NavigationMixin(LightningElement) {
    /** Id of Audio_Visual_Equipment__c to display. */
    recordId;

    @wire(CurrentPageReference) pageRef;

    /** Load the Audio_Visual_Equipment__c to display. */
    @wire(getRecord, { recordId: '$recordId', fields })
    equipment;

    connectedCallback() {
        registerListener('equipmentSelected', this.handleEquipmentSelected, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    /*
     * Handler for when a equipment is selected. When `this.recordId` changes, the @wire
     * above will detect the change and provision new data.
     */
    handleEquipmentSelected(equipmentId) {
        this.recordId = equipmentId;
    }

    handleNavigateToRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: EQUIPMENT_OBJECT.objectApiName,
                actionName: 'view'
            }
        });
    }

    get noData() {
        return !this.equipment.error && !this.equipment.data;
    }
}