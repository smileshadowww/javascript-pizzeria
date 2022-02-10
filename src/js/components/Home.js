import {templates, select, classNames} from '../settings.js';
class Home{
  constructor(element) {
    const thisHome= this;

    thisHome.render(element);
    thisHome.initWidgets();
    thisHome.initPages();
  }
  render(homeWidget) {
    const thisHome= this;
    const generatedHTML = templates.homeWidget();
    thisHome.dom = {};
    thisHome.dom.wrapper =homeWidget;

    thisHome.dom.wrapper.innerHTML = generatedHTML;
  }
  initWidgets() {
    const element = document.querySelector(select.widgets.carousel);

    new Flickity (element,{ // eslint-disable-line
      autoPlay: 3000,
      imagesLoaded: true,
      cellAlign: 'left',
      contain: true
    });
  }
  initPages(){
    const thisHome = this;

    thisHome.pages = document.querySelector(select.containerOf.pages).children;
    thisHome.navLinks = document.querySelectorAll(select.nav.baners);

    for(let link of thisHome.navLinks){
      console.log(thisHome.navLinks);
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();
        const id = clickedElement.getAttribute('href').replace('#', '');
        thisHome.activatePage(id);
        window.location.hash = '#/' + id;
      });
    }
  }
  activatePage(pageId){
    const thisHome = this;
    for(let page of thisHome.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    for(let link of thisHome.navLinks){
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
    }
  }
}
export default Home;
