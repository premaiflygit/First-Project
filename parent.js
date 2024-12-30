import { LightningElement, track } from 'lwc';
export default class Parent extends LightningElement {
    @track messageFromChild = '';

    handleButtonClick(event) {
        this.messageFromChild = event.detail;
    }
}
