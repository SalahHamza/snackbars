import Snackbar from './snackbar';
import {hasItem} from './util';

const OFFLINE_SNACK = {
  name: 'offline',
  message: 'Unable to connect. Retrying...'
}

const ONLINE_SNACK = {
  name: 'online',
  message: 'You are back online',
  duration: 3200
}

export default class Snackbars {
  /**
   *
   * @param {Object} container - DOM element to append snackbar to
   * @param {Boolean} makeNetworkStatusSnackbar - If true (default), makes custome snackbar
   */
  constructor(container, makeNetworkStatusSnackbar = false) {
    this.visibleSnackbar = null;
    this.queue = [];

    window.addEventListener('DOMContentLoaded', event => {
      this.container = container || document.body;
      this.init(makeNetworkStatusSnackbar);
    });
  }

  /**
   *
   * @param {Object} configObj - snackbar configuration object
   */
  show(configObj) {
    const {name, message, actions = [], duration, gap = 500} = configObj;
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
    if(this.visibleSnackbar) {
      if(hasItem(this.queue, 'name', name)) return;
      this.queue.push(configObj);
      return;
    }

    /* making new snackbar and adding it to pending snackbars */
    const snackbar = new Snackbar(name, message, duration);

    /* setting snackbar actions */
    for(const action of actions) {
      snackbar.setAction(action);
    }

    /* If no duration is given & no actions
      are given create a dismiss action */
    if(!duration && !actions.length) {
      snackbar.setAction({ name: 'dismiss' });
    }

    /* show snackbar */
    snackbar.show(this.container);

    /* we put that we currently have a visible snackbar */
    this.visibleSnackbar = snackbar;

    /* we remove the first item of the queue if it exist */
    this.queue.shift();
    this.addSnackbarHideEvent(snackbar, gap);
  }

  /**
   *
   * @param {Object} snackbar - snackbar instance to add event to
   * @param {number} gap - gap to show next snackbar in ms
   */
  addSnackbarHideEvent(snackbar, gap) {
    snackbar.container.addEventListener(`${snackbar.name}_hide`, () => {
      this.visibleSnackbar = null;
      if(this.queue.length) {
        setTimeout(() => {
          this.show(this.queue[0]);
        }, gap);
      }
    });
  }

  _createSnackbarSkeleton() {
    this.container.innerHTML += `<div
      class="snackbar"
      aria-live="assertive"
      aria-atomic="true"
      aria-hidden="true">
      <p class="snackbar-message"></p>
      <div class="snackbutts"></div>
    </div>`;
    this._snackbarSkeleton = document.querySelector('.snackbar');
  }

  init(makeNetworkStatusSnackbar) {

    if(makeNetworkStatusSnackbar) {
      /* Showing offline message when client is offline */
      window.addEventListener('offline', () => {
        this.queue = this.queue.filter(snack => snack.name !== ONLINE_SNACK.name);
        this.show(OFFLINE_SNACK);
      });

      /* showing online message when client is back online */
      window.addEventListener('online', () => {
        this.queue = this.queue.filter(snack => snack.name !== OFFLINE_SNACK.name);
        /* if current visible snackbar is offline
        snackbar, hide it when navigator is online */
        if(this.visibleSnackbar && this.visibleSnackbar.name === OFFLINE_SNACK.name) {
          this.visibleSnackbar.hide();
          this.visibleSnackbar = null;
        }
        this.show(ONLINE_SNACK);
      });
    }
  }

}