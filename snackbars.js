import Snackbar from './snackbar';
import {hasItem} from './util';

const OFFLINE_SNACK = {
  name: 'offline',
  message: 'You are currently offline'
}

export default class Snackbars {
  /**
   *
   * @param {Object} container - DOM element to append snackbar to
   * @param {Boolean} makeCustomeOfflineSnackbar - If true (default), makes makes custome snackbar
   */
  constructor(container = document.body, makeOfflineSnackbar = false) {
    this.container = container;
    this.isActive = false;
    this.queue = [];

    if(makeOfflineSnackbar) {
      /* Showing offline message when client is offline */
      window.addEventListener('offline', () => {
        this.show(OFFLINE_SNACK);
      });
      window.addEventListener('online', () => {
        this.queue = this.queue.filter(snack => snack.name !== OFFLINE_SNACK.name);
      });
    }

  }

  /**
   *
   * @param {Object} configObj - snackbar configuration object
   */
  show(configObj) {
    const {name, message, action, duration, dismissOnAction, gap = 500} = configObj;
    /* checking if the two most important properties are present */
    if(!message || !name){
      throw new Error('Snackbar name or message weren\'t provided.');
    }

    /*
      checking if there a snackbar is already appearing
        - if so we check
          - if the new snackbar is already in the list
            so that we don't show a snackbar two times
            consecutively
          and we add new snackbar to the queue and return.
     */
    if(this.isActive) {
      if(hasItem(this.queue, 'name', name)) return;
      this.queue.push(configObj);
      return;
    }

    /* making new snackbar and adding it to pending snackbars */
    const snackbar = new Snackbar(name, message, duration, dismissOnAction);
    if(action){
      /* setting snackbar action */
      snackbar.setAction(action);
    }
    snackbar.show(this.container);
    /* we put that we currently have a visible snackbar */
    this.isActive = true;
    /* we remove the first item of the queue if it exist */
    this.queue.shift();
    this.addSnackbarHideEvent(snackbar, gap);
  }

  /**
   *
   * @param {Object} snackbar - snackbar instance to add event to
   * @param {*} gap - gap to show next snackbar
   */
  addSnackbarHideEvent(snackbar, gap) {
    snackbar.container.addEventListener(`${snackbar.name}_hide`, () => {
      this.isActive = false;
      if(this.queue.length) {
        setTimeout(() => {
          this.show(this.queue[0]);
        }, gap);
      }
    });
  }

}