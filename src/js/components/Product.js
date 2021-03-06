import {templates, select, classNames} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import {utils} from '../utils.js';
class Product{
  constructor(id, data){
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;
    // // console.log(thisProduct.data);
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();

    // // console.log('new Product:', thisProduct);
  }
  renderInMenu(){
    const thisProduct = this;

    const generatedHTML = templates.menuProduct(thisProduct.data);
    // // console.log(generatedHTML);
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    const menuContainer = document.querySelector(select.containerOf.menu);
    menuContainer.appendChild(thisProduct.element);
  }
  getElements(){
    const thisProduct = this;
    // console.log(thisProduct);
    thisProduct.dom = {};
    thisProduct.dom.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.dom.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.dom.formInputs = thisProduct.dom.form.querySelectorAll(select.all.formInputs);
    thisProduct.dom.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.dom.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.dom.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.dom.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    // thisProduct.dom = {};
    // thisProduct.dom.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    // thisProduct.dom.form = thisProduct.element.querySelector(select.menuProduct.form);
    // thisProduct.dom.formInputs = thisProduct.dom.form.querySelectorAll(select.all.formInputs);
    // thisProduct.dom.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    // thisProduct.dom.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    // thisProduct.dom.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    // thisProduct.dom.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }
  initAccordion(){
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking) */
    // const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);

    /* START: add event listener to clickable trigger on event click */
    thisProduct.dom.accordionTrigger.addEventListener('click', function(event) {
      /* prevent default action for event */
      event.preventDefault();
      /* find active product (product that has active class) */
      const activeProduct = document.querySelector(select.all.menuProductsActive);
      /* if there is active product and it's not thisProduct.element, remove class active from it */
      if (activeProduct != null && activeProduct != thisProduct.element) {
        activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
      }
      /* toggle active class on thisProduct.element */
      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
    });

  }
  initOrderForm(){
    const thisProduct = this;
    // // console.log('initOrderForm', thisProduct);
    thisProduct.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });

    for(let input of thisProduct.dom.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }

    thisProduct.dom.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }
  processOrder(){
    const thisProduct = this;
    // // console.log('thisProduct', thisProduct);
    const formData = utils.serializeFormToObject(thisProduct.dom.form);
    // // console.log('formData', formData);
    // set price to default price
    let price = thisProduct.data.price;

    // for every category (param)...
    for(let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];
      // // console.log(paramId, param);

      // for every option in this category
      for(let optionId in param.options) {
        // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const option = param.options[optionId];
        // // console.log(optionId, option);
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        if(optionSelected){
          if(!option.default == true){
            price += option.price;
          }
        } else {
          // check if the option is default
          if(option.default == true) {
            // reduce price variable
            price -= option.price;
          }
        }
        const selectedImage = thisProduct.dom.imageWrapper.querySelector('.'+paramId+'-'+optionId);
        if(selectedImage){
          if(optionSelected){
            selectedImage.classList.add(classNames.menuProduct.imageVisible);
          } else {
            selectedImage.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }

    // update calculated price in the HTML
    thisProduct.priceSingle = price;
    price *= thisProduct.amountWidget.value;
    thisProduct.dom.priceElem.innerHTML = price;
  }
  initAmountWidget(){
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.dom.amountWidgetElem);
    thisProduct.dom.amountWidgetElem.addEventListener('updated', function () {
      thisProduct.processOrder();
    });
  }
  addToCart(){
    const thisProduct = this;
    // app.cart.add(thisProduct.prepareCartProduct());

    const event = new CustomEvent('add-to-cart', {
      bubbles:true,
      detail: {
        product: thisProduct.prepareCartProduct(),
      },
    });
    // console.log(thisProduct);
    thisProduct.element.dispatchEvent(event);
  }
  prepareCartProduct(){
    const thisProduct = this;

    const productSummary = {};
    productSummary.id = thisProduct.id;
    productSummary.name = thisProduct.data.name;
    productSummary.amount = thisProduct.amountWidget.value;
    // console.log(productSummary.amount);
    productSummary.priceSingle = thisProduct.priceSingle;
    productSummary.price = thisProduct.amountWidget.value * productSummary.priceSingle;
    productSummary.params = thisProduct.prepareCartProductParams();
    // console.log(productSummary);
    return productSummary;
  }
  prepareCartProductParams(){
    const thisProduct = this;
    // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
    const formData = utils.serializeFormToObject(thisProduct.dom.form);
    const params = {};

    // for every category (param)...
    for (let paramID in thisProduct.data.params) {
      const param = thisProduct.data.params[paramID];
      // console.log(paramID, param);

      // create category param in params const eg. params = { ingredients: { name: 'Ingredients', options: {}}}
      params[paramID] = {
        label: param.label,
        options: {},
      };

      // for every option in this category
      for (let optionID in param.options) {
        const option = param.options[optionID];
        const optionSelected =
          formData[paramID] && formData[paramID].includes(optionID);

        if (optionSelected) {
          params[paramID].options = option;
        }
      }
    }
    return params;
  }
}
export default Product;
