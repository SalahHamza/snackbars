
export default class Snackbar {

	constructor(name, message, duration, prioritize = false, order = 0) {
    this.name = name;
    this._message = message;
    this._duration = duration;
    /* used to see if snackbar should be shown ime */
    this.prioritize = prioritize;

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
      }, this._duration);


      // keeping it for later clear
      this._timeouts.push(hideTimeout);
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

  /**
   * hides snackbar and dispatches event that the snackbar was hidden
   */
  hide(){
    this.container.parentNode.removeChild(this.container);

    this.container.dispatchEvent(this._hideEvent);
    /* clear all set timeouts */
    for(let timeout of this._timeouts){
      clearTimeout(timeout);
    }
    this._timeouts = [];
  }

}