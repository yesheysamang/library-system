import { LightningElement, api, track } from 'lwc';

const VARIANTS = {
    info: 'utility:info',
    success: 'utility:success',
    warning: 'utility:warning',
    error: 'utility:error'
};

export default class InlineMessage extends LightningElement {
    /** Generic / user-friendly message */
    @api message = 'Error retrieving data';

    @track iconName = VARIANTS.info;

    _variant = 'info';
    @api
    get variant() {
        return this._variant;
    }
    set variant(value) {
        if (VARIANTS[value]) {
            this._variant = value;
            this.iconName = VARIANTS[value];
        }
    }

    @track viewDetails = false;

    handleCheckboxChange(event) {
        this.viewDetails = event.target.checked;
    }
}