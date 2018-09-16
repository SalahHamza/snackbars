import Snackbar from './snackbar';

const OFFLINE_SNACK = {
  name: 'offline',
  message: 'You are currently offline',
  actions: [{
    name: 'dismiss'
  }]
}

export default class Snackbars {
  /**
   *
   * @param {Object} container - DOM element to append snackbar to
   * @param {Boolean} makeCustomeOfflineSnackbar - If true (default), makes makes custome snackbar
   */
  constructor(container, makeCustomeOfflineSnackbar = true) {
    this.container = container;
    this._pendingSnackbars = new Map();

    if(makeCustomeOfflineSnackbar) {
      this._makeCustomeOfflineSnackbar();
    }

  }


  /**
   *
   * @param {Object} param0 - snackbar configuration object
   */
  make({name, message, prioritize, duration, actions = []}){
    if(!message || !name) throw new Error('No snackbar message provided');

    /* making new snackbar and adding it to pending snackbars */
    const snackbar = new Snackbar(name, message, duration, prioritize);
    this._pendingSnackbars.set(name, snackbar);

    /* setting snackbar actions */
    for(const action of actions){
      snackbar.setAction(action.name, action.callback)
    }

    /* listening for snackbar is hidden */
    snackbar.container.addEventListener(`${name}_hide`, (e) => {
      this._pendingSnackbars.delete(name);
      this._visibleSnackbar = null;

      /* chechking if there is a pending snackbar and showing it */
      if(this._pendingSnackbars.size > 0){
        const snackToShowName = this._pendingSnackbars.keys().next().value;
        this.show(snackToShowName);
      }
    });
  }

  /**
   * @param {String} snackbarName - snackbar name to show
   */
  show(snackbarName){
    const snack = this.get(snackbarName);
    /* checking if there is a snackbar visible */
    if(!this._visibleSnackbar){
      /* if not, we set the new to-be visible snackbar */
      this._visibleSnackbar = snack;
    } else {
      /* if so, we check if snack bar should be prioritized,
      and decide whether to show it or not */
      if(!snack.prioritize) return;

      this._visibleSnackbar.hide();
      this._visibleSnackbar = snack;
    }
    this._visibleSnackbar.show(this.container);
  }

  /**
   * shortcut to get snackbar from pending snackbars
   * @param {String} snackbarName - snackbar name to get
   */
  get(snackbarName){
    return this._pendingSnackbars.get(snackbarName);
  }

  /**
   * makes a custome offline snackbar, that appears when
   * network connection is lost, and disappears when
   * network connection is back again
   */
  _makeCustomeOfflineSnackbar(){
    /* Showing offline message when client is offline */
    window.addEventListener('offline', () => {
      this.make(OFFLINE_SNACK);
      this.get(OFFLINE_SNACK.name).prioritize = true;
      this.show(OFFLINE_SNACK.name);
    });


    /* Removing message when client is offline */
    window.addEventListener('online', () => {
      if(this._pendingSnackbars.has(OFFLINE_SNACK.name) &&
         this._visibleSnackbar.name === OFFLINE_SNACK.name) {

        this._visibleSnackbar.hide();
        this._visibleSnackbar = null;
        this._pendingSnackbars.delete(OFFLINE_SNACK.name);
      }
    });
  }
}