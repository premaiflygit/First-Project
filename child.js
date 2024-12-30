import { LightningElement, track } from 'lwc';
export default class Child extends LightningElement {

    handleButtonClick(event) {
    console.log("Event received in Child: ", event.detail);
}


}
