import { isHexColor } from "./util";

export default class Snackbar {

  /**
   *
   * @param {string} name - Snackbar name
   * @param {string} message - Snackbar message
   * @param {number} duration - Snackbar lifetime in miliseconds
   * @param {object} container - The snackbar skeleton
   */
	constructor(name, message, duration, container) {
    this.name = name;
    this.message = message;
    this.container = container;

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
    /* create snackbar message */
    const messageElem = this.container.querySelector('.snackbar-message');
    messageElem.textContent = this.message;

    this._buttonsContainer = this.container.querySelector('.snackbutts');

    // removing all snackbar buttons if they exist
    while (this._buttonsContainer.firstChild) {
      this._buttonsContainer.removeChild(this._buttonsContainer.firstChild);
    }
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

    this._buttonsContainer.appendChild(buttonElem);

    return this;
  }

  /**
   *
   * @param {Object} nodeToAppendTo - DOM object to append snackbar to
   */
  show(){
    this.container.classList.add('snackbar-visible');
  }

  /**
   * hides snackbar and dispatches event that the snackbar was hidden
   */
  hide(){
    this.container.classList.remove('snackbar-visible');
    /* dispatch an event that current snackbar was hidden */
    this.container.dispatchEvent(this._hideEvent);
  }

}