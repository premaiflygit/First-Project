import { LightningElement, track } from 'lwc';
export default class GrandChild extends LightningElement {
    

    message = '';

    handleInputChange(event) {
        this.message = event.target.value;
        const selectEvent = new CustomEvent('buttonclick', {
            bubbles: true,
            composed: true,
            detail: this.message,
        });
        this.dispatchEvent(selectEvent);
    }
}
