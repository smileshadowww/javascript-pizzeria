class BaseWidget{
  constructor(wrapperElement, initialValue){
    const thisWidget = this;
    console.log(wrapperElement);
    // thisWidget.value = 1;
    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;
    console.log(thisWidget.value);
    thisWidget.correctValue = initialValue;
    //****************************
    console.log(thisWidget.correctValue);
  }
  get value(){
    const thisWidget = this;
    console.log(thisWidget.correctValue);
    return thisWidget.correctValue;
  }
  set value(value){
    const thisWidget = this;
    const newValue = thisWidget.parseValue(value);
    if(thisWidget.correctValue !== newValue && thisWidget.isValid(newValue)){
      thisWidget.correctValue = newValue;
      thisWidget.announce();
    }
    thisWidget.renderValue();
  }
  setValue(value){
    const thisWidget = this;
    thisWidget.value = value;
  }
  parseValue(value){
    return parseInt(value);

  }
  isValid(value){
    return !isNaN(value);
  }
  renderValue(){
    const thisWidget = this;
    thisWidget.dom.wrapper.innerHTML = thisWidget.value;
  }
  announce(){
    const thisWidget = this;
    const event = new CustomEvent('updated',{
      bubbles:true
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}

export default BaseWidget;
