import {settings, select} from '../settings.js';
import BaseWidget from './BaseWidget.js';
class AmountWidget extends BaseWidget{
  constructor(element){
    super(element, settings.amountWidget.defaultValue);
    const thisWidget = this;
    // console.log('AmountWidget: ', thisWidget);
    // console.log('constructor arguments: ', element);
    // thisWidget.value = 1;
    thisWidget.getElements(element);
    console.log(element);
    // thisWidget.value = 1;
    thisWidget.initActions();
    // thisWidget.correctValue = thisWidget.dom.input.getAttribute('value');
    // thisWidget.renderValue();
    // thisWidget.dom.input.value = element.input.value;
    // console.log(thisWidget);
  }
  getElements(){
    const thisWidget = this;
    // thisWidget.dom.wrapper = element;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    // console.log(thisWidget.dom.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }
  isValid(value){
    return !isNaN(value)
      && value >= settings.amountWidget.defaultMin
      && value <= settings.amountWidget.defaultMax;
  }
  renderValue(){
    const thisWidget = this;
    thisWidget.dom.input.value = thisWidget.value;
    console.log(thisWidget.value);
  }
  initActions(){
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function(){
      thisWidget.setValue(thisWidget.input.value);
      // thisWidget.value = thisWidget.dom.input.value;
      // console.log(thisWidget.value);
    });
    thisWidget.dom.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      // console.log(thisWidget.value);
      thisWidget.setValue(thisWidget.value - 1);
      // console.log(thisWidget.value);
    });
    thisWidget.dom.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      // thisWidget.value = thisWidget.correctValue;
      console.log(thisWidget.value);
      console.log(thisWidget);
      thisWidget.setValue(thisWidget.value + 1);
      console.log(thisWidget.value);
      // console.log(thisWidget.correctValue);
    });

  }
}

export default AmountWidget;
