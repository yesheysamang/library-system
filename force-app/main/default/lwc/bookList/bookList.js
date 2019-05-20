import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';


/** getBooks() method in BookController Apex class */
import getBooks from '@salesforce/apex/BookController.getBooks';

/** Pub-sub mechanism for sibling component communication. */
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

export default class BookList extends LightningElement {
    /**
     * Whether to display the search bar.
     * TODO - normalize value because it may come as a boolean, string or otherwise.
     */
    @api searchBarIsVisible = false;

    /**
     * Whether the product tiles are draggable.
     * TODO - normalize value because it may come as a boolean, string or otherwise.
     */
    @api tilesAreDraggable = false;

    /** All available Book__c[]. */
    @track books = [];

    /** Current page in the book list. */
    @track pageNumber = 1;

    /** The number of books on a page. */
    @track pageSize;

    /** The total number of items matching the selection. */
    @track totalItemCount = 0;

    /** JSON.stringified version of filters to pass to apex */
    filters = '{}';

    @wire(CurrentPageReference) pageRef;

    /**
     * Load the list of available books.
     */
    @wire(getBooks, { filters: '$filters', pageNumber: '$pageNumber' })
    books;

    connectedCallback() {
        registerListener('filterChange', this.handleFilterChange, this);
    }

    handleBookSelected(event) {
        fireEvent(this.pageRef, 'bookSelected', event.detail);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    handleSearchKeyChange(event) {
        const searchKey = event.target.value.toLowerCase();
        this.handleFilterChange({ searchKey });
    }

    handleFilterChange(filters) {
        this.filters = JSON.stringify(filters);
        this.pageNumber = 1;
    }

    handlePreviousPage() {
        this.pageNumber = this.pageNumber - 1;
    }

    handleNextPage() {
        this.pageNumber = this.pageNumber + 1;
    }
}