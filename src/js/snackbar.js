import { isHexColor } from "./util";

export default class Snackbar {

  /**
   *
   * @param {string} name - Snackbar name
   * @param {string} message - Snackbar message
   * @param {number} duration - Snackbar lifetime in miliseconds
   */
	constructor(name, message, duration) {
    this.name = name;
    this.message = message;

    /* creating snackbar */
    this.create();

    if(duration) {
      /* set a timeout to hide snackbar */
      this.hideTimeout = setTimeout(() => {
        this.hide();
      }, duration);
    }

    /* adding event, to check if snackbar was deleted */
    const eventName = `${this.name}_hide`;
    // create and dispatch the event
    this._hideEvent = new CustomEvent(eventName);

  }


  /**
   * Creates snackbar container and sets message
   */
	create(){

		/* create snackbar Container */
    this.container = document.createElement('div');
    this.container.classList.add('snackbar');

    /* create snackbar message */
    const messageElem = document.createElement('p');
		messageElem.classList.add('snackbar-message');
    messageElem.textContent = this.message;
    this.container.appendChild(messageElem);

    // returning 'this' for chaining
    return this;
  }

  /**
   *
   * @param {String} name - name of the action (and button textContent)
   * @param {Function} callback - Function to call when action called (button click)
   * @param {Boolean} hideManually - hide the snackbar manually if 'true'
   */
  setAction({name, handler, dismissOnAction = true, textColor}){
    let buttonsContainer = this.container.querySelector('.snackbutts');
    if(!buttonsContainer) {
      buttonsContainer = document.createElement('div');
      buttonsContainer.classList.add('snackbutts');
      this.container.appendChild(buttonsContainer);
    }

    const buttonElem = document.createElement('button');
    buttonElem.classList.add('snackbar-button');
    buttonElem.innerText = name;
    /* setting action button color if given */
    if(isHexColor(textColor)) {
      buttonElem.style.color = textColor;
    }

    /* Action Event */
    buttonElem.addEventListener('click', (event) => {
      if(handler){
        handler(event.target, this.container);
      }
      if(dismissOnAction) {
        clearTimeout(this.hideTimeout);
        this.hide();
      }
    });

    buttonsContainer.appendChild(buttonElem);

    return this;
  }

  /**
   *
   * @param {Object} nodeToAppendTo - DOM object to append snackbar to
   */
  show(nodeToAppendTo){
    nodeToAppendTo.appendChild(this.container);
    setTimeout(() => {
      this.container.classList.add('snackbar-visible');
    }, 250);
  }

  /**
   * hides snackbar and dispatches event that the snackbar was hidden
   */
  hide(){
    this.container.classList.remove('snackbar-visible');
    setTimeout(() => {
      this.container.parentNode.removeChild(this.container);
    }, 250);
    /* dispatch an event that current snackbar was hidden */
    this.container.dispatchEvent(this._hideEvent);
  }

}