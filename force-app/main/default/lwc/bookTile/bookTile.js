import { LightningElement, api, track } from 'lwc';

export default class BookTile extends LightningElement {
    _book;
    /** Book__c to display. */
    @api
    get book() {
        return this._book;
    }
    set book(value) {
        this._book = value;
        this.pictureUrl = value.Picture_URL__c;
        this.name = value.Name;
        this.author = value.Author__c;
    }

    /** Book__c field values to display. */
    @track pictureUrl;
    @track name;
    @track author;

    handleClick() {
        const selectedEvent = new CustomEvent('selected', {
            detail: this.book.Id
        });
        this.dispatchEvent(selectedEvent);
    }

    handleDragStart(event) {
        event.dataTransfer.setData('book', JSON.stringify(this.book));
    }

}