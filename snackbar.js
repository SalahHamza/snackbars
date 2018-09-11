import { containerStyles, messageStyles, buttonStyles} from 'snackbarStyles';

const STYLES = `${containerStyles}${messageStyles}${buttonStyles}`;


export default class Snackbar {
	constructor(message, duration) {
    this._message = message;
    this._duration = duration;

    /* keeping a list of all timeouts to
    clear them when snackbar is gone */
    this._timeouts = [];

    /* creating snackbar */
    this.create();

    /* setting timeout to hide snackbar if duration is provided */
    if(this._duration && this._duration > 0){
      // set a timeout && hide (clear timeout as well)
      const hideTimeout = setTimeout(() => {
        this.hide();
      }, this._duration * 1000);
      // keeping it for later clear
      this._timeouts.push(hideTimeout);
    }

    Snackbar.setSnackbarCSS = Snackbar.setSnackbarCSS.bind(this);
  }

  /**
   * sets a Stylesheet with snackbar styles in the head element
   * @param {Object} doc - document DOM object for the app
   */
  static setSnackbarCSS(doc){
    const head = doc.head || doc.getElementsByTagName('head')[0],
    style = doc.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
      // This is required for IE8 and below.
      style.styleSheet.cssText = STYLES;
    } else {
      style.appendChild(doc.createTextNode(STYLES));
    }
    head.appendChild(style);
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
		messageElem.classList.add('message');
    messageElem.textContent = this._message;
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
  setAction(name, callback, hideManually = false){
    const buttonElem = document.createElement('button');
    buttonElem.classList.add('snackbut');
    buttonElem.innerText = name;

    /* Action Event */
    buttonElem.addEventListener('click', (event) => {
      if(callback){
        callback(event.target, this.container);
      }
      if(hideManually) return;
      this.hide();
    });

    this.container.appendChild(buttonElem);

    return this;
  }

  /**
   *
   * @param {Object} nodeToAppendTo - DOM object to append snackbar to
   */
  show(nodeToAppendTo){
    nodeToAppendTo.appendChild(this.container);
    // set timeout to fade snacbar in
    const opacityTimeout = setTimeout(() => {
      this.container.style.opacity = '1';
    }, 500);
    this._timeouts.push(opacityTimeout);
  }

  hide(){
    this.container.parentNode.removeChild(this.container);

    /* clear all set timeouts */
    for(let timeout in this._timeouts){
      clearTimeout(timeout);
    }
    this._timeouts = [];
  }

}