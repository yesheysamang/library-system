import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';

/** Wire adapter to load records, utils to extract values. */
import { getRecord } from 'lightning/uiRecordApi';

/** Pub-sub mechanism for sibling component communication. */
import { registerListener, unregisterAllListeners } from 'c/pubsub';

/** Book__c Schema. */
import BOOK_OBJECT from '@salesforce/schema/Book__c';
import NAME_FIELD from '@salesforce/schema/Book__c.Name';
import AUTHOR_FIELD from '@salesforce/schema/Book__c.Author__c';
import ID_FIELD from '@salesforce/schema/Book__c.Book_Id__c';
import TYPE_FIELD from '@salesforce/schema/Book__c.Book_Type__c';
import DATE_LAST_BORROWED_FIELD from '@salesforce/schema/Book__c.Date_Last_Borrowed__c';
import AVAILIBILITY_FIELD from '@salesforce/schema/Book__c.Book_Status__c';
import PUB_DATE_FIELD from '@salesforce/schema/Book__c.Publish_Date__c';
import PICTURE_URL_FIELD from '@salesforce/schema/Book__c.Picture_URL__c';

/** Record fields to load. */
const fields = [
    NAME_FIELD,
    AUTHOR_FIELD,
    ID_FIELD,
    TYPE_FIELD,
    DATE_LAST_BORROWED_FIELD,
    AVAILIBILITY_FIELD,
    PUB_DATE_FIELD,
    PICTURE_URL_FIELD
];

/**
 * Component to display details of a Book__c.
 */
export default class BookDetails extends NavigationMixin(LightningElement) {
    /** Id of Book__c to display. */
    recordId;

    @wire(CurrentPageReference) pageRef;

    /** Load the Book__c to display. */
    @wire(getRecord, { recordId: '$recordId', fields })
    book;

    connectedCallback() {
        registerListener('bookSelected', this.handleBookSelected, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    /*
     * Handler for when a book is selected. When `this.recordId` changes, the @wire
     * above will detect the change and provision new data.
     */
    handleBookSelected(bookId) {
        this.recordId = bookId;
    }

    handleNavigateToRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: BOOK_OBJECT.objectApiName,
                actionName: 'view'
            }
        });
    }

    get noData() {
        return !this.book.error && !this.book.data;
    }
}