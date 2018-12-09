import Snackbar from "./snackbar";
import { hasItem, onDOMContentLoadedOrAfter } from "./util";

// DEFAULTS
const NETWORK_SNACKBARS_DURATION = 3200;
const NETWORK_SNACKBARS_NAME_SUFFIX = "--default-snackbar";
const DEFAULT_GAP = 500;

const OFFLINE_SNACK = {
  name: "offline" + NETWORK_SNACKBARS_NAME_SUFFIX,
  message: "You seem to be offline",
  duration: NETWORK_SNACKBARS_DURATION,
};

const ONLINE_SNACK = {
  name: "online" + NETWORK_SNACKBARS_NAME_SUFFIX,
  message: "You are back online",
  duration: NETWORK_SNACKBARS_DURATION,
};

export default class Snackbars {
  /**
   *
   * @param {Object} container - DOM element to append snackbar to.
   * defaults to body element
   * @param {Boolean} makeNetworkStatusSnackbar - If true (default)
   * makes custome nework (offline/online) snackbars
   */
  constructor(container, makeNetworkStatusSnackbar = false) {
    this.visibleSnackbar = null;
    this.queue = [];

    onDOMContentLoadedOrAfter(() => {
      this.container = container || document.body;
      this._init(makeNetworkStatusSnackbar);
    });
  }

  /**
   *
   * @param {Object} configObj - snackbar configuration object
   */
  show(configObj) {
    const {
      name,
      message,
      actions = [],
      duration,
      gap = DEFAULT_GAP,
    } = configObj;
    /* checking if the two most important properties are present */
    if (!message || !name) {
      throw new Error("Snackbar name or message weren't provided.");
    }

    /*
      checking if there a snackbar is already appearing
        - if so we check
          - if the new snackbar is already in the list
            so that we don't show a snackbar two times
            consecutively
          and we add new snackbar to the queue and return.
     */
    if (this.visibleSnackbar) {
      if (hasItem(this.queue, "name", name)) return;
      this.queue.push(configObj);
      return;
    }

    /* making new snackbar and adding it to pending snackbars */
    const snackbar = new Snackbar({
      name,
      message,
      duration,
      container: this._snackbarSkeleton,
      actions,
    });

    /* show snackbar */
    snackbar.show();

    /* we put that we currently have a visible snackbar */
    this.visibleSnackbar = snackbar;

    /* we remove the first item of the queue if it exist */
    this.queue.shift();
    this._addSnackbarHideEvent(snackbar, gap);
  }

  /**
   *
   * @param {Object} snackbar - snackbar instance to add event to
   * @param {number} gap - gap to show next snackbar in ms
   */
  _addSnackbarHideEvent(snackbar, gap) {
    snackbar.container.addEventListener(`${snackbar.name}_hide`, () => {
      this.visibleSnackbar = null;
      if (this.queue.length) {
        setTimeout(() => {
          this.show(this.queue[0]);
        }, gap);
      }
    });
  }

  _createSnackbarSkeleton() {
    this.container.insertAdjacentHTML(
      "beforeend",
      `<div
      class="snackbar"
      aria-live="polite"
      aria-atomic="true"
      aria-hidden="true">
      <p class="snackbar-message"></p>
      <div class="snackbutts"></div>
    </div>`,
    );
    this._snackbarSkeleton = document.querySelector(".snackbar");
  }

  _init(makeNetworkStatusSnackbar) {
    // creating snackbar skeleton
    this._createSnackbarSkeleton();

    if (makeNetworkStatusSnackbar) {
      /* Showing offline message when client is offline */
      window.addEventListener("offline", () => {
        this.queue = this.queue.filter(
          snack => snack.name !== ONLINE_SNACK.name,
        );
        this.show(OFFLINE_SNACK);
      });

      /* showing online message when client is back online */
      window.addEventListener("online", () => {
        this.queue = this.queue.filter(
          snack => snack.name !== OFFLINE_SNACK.name,
        );
        /* if current visible snackbar is offline
        snackbar, hide it when navigator is online */
        if (
          this.visibleSnackbar &&
          this.visibleSnackbar.name === OFFLINE_SNACK.name
        ) {
          this.visibleSnackbar.hide();
          this.visibleSnackbar = null;
        }
        // giving the offline snackbar enough time to hide
        setTimeout(() => {
          this.show(ONLINE_SNACK);
        }, DEFAULT_GAP);
      });
    }
  }
}
