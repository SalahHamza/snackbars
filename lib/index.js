function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/**
 *
 * @param {Array} arr - array to check for item
 * @param {String} propName - the targeted property name
 * @param {*} value - value to check for
 */
var hasItem = function hasItem(arr, propName, value) {
  if (!Array.isArray(arr)) throw new Error('Array was not provided.');
  /* stringifying the property name */

  propName = propName.toString();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      if (_typeof(item) === 'object' && item.hasOwnProperty(propName) && item[propName] === value) {
        return true;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return false;
};
/**
 *
 * @param {String} hexColorString - Hex string to check (e.g. #FF00AA - not case sentsitive)
 */

var isHexColor = function isHexColor(hexColorString) {
  return /^#[0-9A-F]{6}$/i.test(hexColorString);
};
/**
 * Invokes callback function on `DOMContentLoaded` event or immediately if
 * `DOMContentLoaded` event has already fired (i.e `document.readyState` is `loading`)
 * @param {Function} callback - callback to call when `DOMContentLoaded` fires or
 * after it fires
 */

var onDOMContentLoadedOrAfter = function onDOMContentLoadedOrAfter(callback) {
  // catch if 'DOMContentLoaded' already fired
  if (document.readyState === "loading") {
    window.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
};

var Snackbar =
/*#__PURE__*/
function () {
  /**
   *
   * @param {string} name - Snackbar name
   * @param {string} message - Snackbar message
   * @param {number} duration - Snackbar lifetime in miliseconds
   * @param {object} container - The snackbar skeleton
   */
  function Snackbar(_ref) {
    var _this = this;

    var name = _ref.name,
        message = _ref.message,
        duration = _ref.duration,
        container = _ref.container,
        actions = _ref.actions;

    _classCallCheck(this, Snackbar);

    this.name = name;
    this.message = message;
    this.container = container;
    this.actions = actions;
    this.duration = duration;
    /* creating snackbar */

    this.create();

    if (duration) {
      /* set a timeout to hide snackbar */
      this.hideTimeout = setTimeout(function () {
        _this.hide();
      }, duration);
    }
    /* adding event, to check if snackbar was deleted */


    var eventName = "".concat(this.name, "_hide"); // create and dispatch the event

    this._hideEvent = new CustomEvent(eventName);
  }
  /**
   * Creates snackbar container and sets message
   */


  _createClass(Snackbar, [{
    key: "create",
    value: function create() {
      /* create snackbar message */
      var messageElem = this.container.querySelector('.snackbar-message');
      messageElem.textContent = this.message;
      this._buttonsContainer = this.container.querySelector('.snackbutts'); // removing all snackbar buttons if they exist

      while (this._buttonsContainer.firstChild) {
        this._buttonsContainer.removeChild(this._buttonsContainer.firstChild);
      }
      /* setting snackbar actions */


      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var action = _step.value;
          this.setAction(action);
        }
        /* If no duration is given & no actions
          are given create a dismiss action */

      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (!this.duration && !this.actions.length) {
        this.setAction({
          name: 'dismiss'
        });
      } // returning 'this' for chaining


      return this;
    }
    /**
     *
     * @param {String} name - name of the action (and button textContent)
     * @param {Function} callback - Function to call when action called (button click)
     * @param {Boolean} hideManually - hide the snackbar manually if 'true'
     */

  }, {
    key: "setAction",
    value: function setAction(_ref2) {
      var _this2 = this;

      var name = _ref2.name,
          handler = _ref2.handler,
          _ref2$dismissOnAction = _ref2.dismissOnAction,
          dismissOnAction = _ref2$dismissOnAction === void 0 ? true : _ref2$dismissOnAction,
          textColor = _ref2.textColor;
      var buttonElem = document.createElement('button');
      buttonElem.classList.add('snackbar-button');
      buttonElem.innerText = name;
      /* setting action button color if given */

      if (isHexColor(textColor)) {
        buttonElem.style.color = textColor;
      }
      /* Action Event */


      buttonElem.addEventListener('click', function (event) {
        if (handler) {
          handler(event.target, _this2.container);
        }

        if (dismissOnAction) {
          clearTimeout(_this2.hideTimeout);

          _this2.hide();
        }
      });

      this._buttonsContainer.appendChild(buttonElem);

      return this;
    }
    /**
     *
     * @param {Object} nodeToAppendTo - DOM object to append snackbar to
     */

  }, {
    key: "show",
    value: function show() {
      var _this3 = this;

      this.container.classList.add('snackbar-visible');
      this.container.setAttribute('aria-hidden', false); // giving chance to the element to render first

      setTimeout(function () {
        _this3.container.focus();
      }, 250);
    }
    /**
     * hides snackbar and dispatches event that the snackbar was hidden
     */

  }, {
    key: "hide",
    value: function hide() {
      this.container.classList.remove('snackbar-visible');
      this.container.setAttribute('aria-hidden', true);
      /* dispatch an event that current snackbar was hidden */

      this.container.dispatchEvent(this._hideEvent);
    }
  }]);

  return Snackbar;
}();

var NETWORK_SNACKBARS_DURATION = 3200;
var NETWORK_SNACKBARS_NAME_SUFFIX = '--default-snackbar';
var DEFAULT_GAP = 500;
var OFFLINE_SNACK = {
  name: 'offline' + NETWORK_SNACKBARS_NAME_SUFFIX,
  message: 'You seem to be offline',
  duration: NETWORK_SNACKBARS_DURATION
};
var ONLINE_SNACK = {
  name: 'online' + NETWORK_SNACKBARS_NAME_SUFFIX,
  message: 'You are back online',
  duration: NETWORK_SNACKBARS_DURATION
};

var Snackbars =
/*#__PURE__*/
function () {
  /**
   *
   * @param {Object} container - DOM element to append snackbar to.
   * defaults to body element
   * @param {Boolean} makeNetworkStatusSnackbar - If true (default)
   * makes custome nework (offline/online) snackbars
   */
  function Snackbars(container) {
    var _this = this;

    var makeNetworkStatusSnackbar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, Snackbars);

    this.visibleSnackbar = null;
    this.queue = [];
    onDOMContentLoadedOrAfter(function () {
      _this.container = container || document.body;

      _this._init(makeNetworkStatusSnackbar);
    });
  }
  /**
   *
   * @param {Object} configObj - snackbar configuration object
   */


  _createClass(Snackbars, [{
    key: "show",
    value: function show(configObj) {
      var name = configObj.name,
          message = configObj.message,
          _configObj$actions = configObj.actions,
          actions = _configObj$actions === void 0 ? [] : _configObj$actions,
          duration = configObj.duration,
          _configObj$gap = configObj.gap,
          gap = _configObj$gap === void 0 ? DEFAULT_GAP : _configObj$gap;
      /* checking if the two most important properties are present */

      if (!message || !name) {
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


      if (this.visibleSnackbar) {
        if (hasItem(this.queue, 'name', name)) return;
        this.queue.push(configObj);
        return;
      }
      /* making new snackbar and adding it to pending snackbars */


      var snackbar = new Snackbar({
        name: name,
        message: message,
        duration: duration,
        container: this._snackbarSkeleton,
        actions: actions
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

  }, {
    key: "_addSnackbarHideEvent",
    value: function _addSnackbarHideEvent(snackbar, gap) {
      var _this2 = this;

      snackbar.container.addEventListener("".concat(snackbar.name, "_hide"), function () {
        _this2.visibleSnackbar = null;

        if (_this2.queue.length) {
          setTimeout(function () {
            _this2.show(_this2.queue[0]);
          }, gap);
        }
      });
    }
  }, {
    key: "_createSnackbarSkeleton",
    value: function _createSnackbarSkeleton() {
      this.container.insertAdjacentHTML('beforeend', "<div\n      class=\"snackbar\"\n      aria-live=\"polite\"\n      aria-atomic=\"true\"\n      aria-hidden=\"true\">\n      <p class=\"snackbar-message\"></p>\n      <div class=\"snackbutts\"></div>\n    </div>");
      this._snackbarSkeleton = document.querySelector('.snackbar');
    }
  }, {
    key: "_init",
    value: function _init(makeNetworkStatusSnackbar) {
      var _this3 = this;

      // creating snackbar skeleton
      this._createSnackbarSkeleton();

      if (makeNetworkStatusSnackbar) {
        /* Showing offline message when client is offline */
        window.addEventListener('offline', function () {
          _this3.queue = _this3.queue.filter(function (snack) {
            return snack.name !== ONLINE_SNACK.name;
          });

          _this3.show(OFFLINE_SNACK);
        });
        /* showing online message when client is back online */

        window.addEventListener('online', function () {
          _this3.queue = _this3.queue.filter(function (snack) {
            return snack.name !== OFFLINE_SNACK.name;
          });
          /* if current visible snackbar is offline
          snackbar, hide it when navigator is online */

          if (_this3.visibleSnackbar && _this3.visibleSnackbar.name === OFFLINE_SNACK.name) {
            _this3.visibleSnackbar.hide();

            _this3.visibleSnackbar = null;
          } // giving the offline snackbar enough time to hide


          setTimeout(function () {
            _this3.show(ONLINE_SNACK);
          }, DEFAULT_GAP);
        });
      }
    }
  }]);

  return Snackbars;
}();

export default Snackbars;
