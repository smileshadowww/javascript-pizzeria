import {settings, select, classNames, templates} from '../settings.js';
import {utils} from '../utils.js';
import CartProduct from './CartProduct.js';
class Cart{
  constructor(element){
    const thisCart = this;
    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions(element);
  }
  getElements(element){
    const thisCart = this;

    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = element.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = element.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = element.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);
    thisCart.dom.form = element.querySelector(select.cart.form);
    thisCart.dom.phone = element.querySelector(select.cart.phone);
    thisCart.dom.address = element.querySelector(select.cart.address);
  }
  initActions(){
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function(event){
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function (event) {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function(){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }
  add(menuProduct){
    const thisCart = this;
    const generatedHTML = templates.cartProduct(menuProduct);
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    thisCart.dom.productList.appendChild(generatedDOM);
    // console.log(thisCart.products);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    thisCart.update();
    // // console.log('adding product', menuProduct);
  }
  update(){
    const thisCart = this;

    const deliveryFee = settings.cart.defaultDeliveryFee;

    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for(let product of thisCart.products){
      thisCart.totalNumber += product.amount;
      thisCart.subtotalPrice += product.price;
    }
    // thisCart.totalPrice = thisCart.subtotalPrice + deliveryFee;
    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    // console.log(thisCart.totalNumber);
    if(thisCart.totalNumber == 0){
      thisCart.dom.totalPrice.forEach(element => element.innerHTML = 0);
      thisCart.dom.deliveryFee.innerHTML = 0;
    } else {
      // console.log(deliveryFee);
      // console.log(thisCart.dom.deliveryFee);
      thisCart.dom.deliveryFee.innerHTML = deliveryFee;
      thisCart.totalPrice = thisCart.subtotalPrice + deliveryFee;
      thisCart.dom.totalPrice.forEach(element => element.innerHTML = thisCart.totalPrice);
      // console.log(thisCart.totalPrice);
    }
  }
  remove(productToDelete){
    const thisCart = this;
    const indexOfProduct = thisCart.products.indexOf(productToDelete);
    // console.log(indexOfProduct);
    thisCart.products.splice(indexOfProduct, 1);
    // console.log(this);
    productToDelete.dom.wrapper.remove();
    thisCart.update();

  }
  sendOrder(){
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.orders;

    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.dom.totalPrice,
      subtotalPrice: thisCart.dom.subTotalPrice,
      totalNumber: thisCart.dom.totalNumber,
      deliveryFee: settings.cart.defaultDeliveryFee,
      products: [],
    };
    for(let product of thisCart.products){
      // console.log(thisCart.products);
      payload.products.push(product.getData());
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    fetch(url, options)
      .then(function(response){
        return response.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });
  }

}
export default Cart;
