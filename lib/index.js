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

var Snackbar =
/*#__PURE__*/
function () {
  /**
   *
   * @param {string} name - Snackbar name
   * @param {string} message - Snackbar message
   * @param {number} duration - Snackbar lifetime in miliseconds
   */
  function Snackbar(name, message, duration) {
    var _this = this;

    _classCallCheck(this, Snackbar);

    this.name = name;
    this.message = message;
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
      /* create snackbar Container */
      this.container = document.createElement('div');
      this.container.classList.add('snackbar');
      /* create snackbar message */

      var messageElem = document.createElement('p');
      messageElem.classList.add('snackbar-message');
      messageElem.textContent = this.message;
      this.container.appendChild(messageElem); // returning 'this' for chaining

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
    value: function setAction(_ref) {
      var _this2 = this;

      var name = _ref.name,
          handler = _ref.handler,
          _ref$dismissOnAction = _ref.dismissOnAction,
          dismissOnAction = _ref$dismissOnAction === void 0 ? true : _ref$dismissOnAction,
          textColor = _ref.textColor;
      var buttonsContainer = this.container.querySelector('.snackbutts');

      if (!buttonsContainer) {
        buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('snackbutts');
        this.container.appendChild(buttonsContainer);
      }

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
      buttonsContainer.appendChild(buttonElem);
      return this;
    }
    /**
     *
     * @param {Object} nodeToAppendTo - DOM object to append snackbar to
     */

  }, {
    key: "show",
    value: function show(nodeToAppendTo) {
      var _this3 = this;

      nodeToAppendTo.appendChild(this.container);
      setTimeout(function () {
        _this3.container.classList.add('snackbar-visible');
      }, 250);
    }
    /**
     * hides snackbar and dispatches event that the snackbar was hidden
     */

  }, {
    key: "hide",
    value: function hide() {
      var _this4 = this;

      this.container.classList.remove('snackbar-visible');
      setTimeout(function () {
        _this4.container.parentNode.removeChild(_this4.container);
      }, 250);
      /* dispatch an event that current snackbar was hidden */

      this.container.dispatchEvent(this._hideEvent);
    }
  }]);

  return Snackbar;
}();

var OFFLINE_SNACK = {
  name: 'offline',
  message: 'Unable to connect. Retrying...'
};
var ONLINE_SNACK = {
  name: 'online',
  message: 'You are back online',
  duration: 3200
};

var Snackbars =
/*#__PURE__*/
function () {
  /**
   *
   * @param {Object} container - DOM element to append snackbar to
   * @param {Boolean} makeCustomeOfflineSnackbar - If true (default), makes custome snackbar
   */
  function Snackbars(container) {
    var _this = this;

    var makeNetworkStatusSnackbar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, Snackbars);

    this.container = container;
    this.visibleSnackbar = null;
    this.queue = [];

    if (makeNetworkStatusSnackbar) {
      /* Showing offline message when client is offline */
      window.addEventListener('offline', function () {
        _this.queue = _this.queue.filter(function (snack) {
          return snack.name !== ONLINE_SNACK.name;
        });

        _this.show(OFFLINE_SNACK);
      });
      /* showing online message when client is back online */

      window.addEventListener('online', function () {
        _this.queue = _this.queue.filter(function (snack) {
          return snack.name !== OFFLINE_SNACK.name;
        });
        /* if current visible snackbar is offline
        snackbar, hide it when navigator is online */

        if (_this.visibleSnackbar && _this.visibleSnackbar.name === OFFLINE_SNACK.name) {
          _this.visibleSnackbar.hide();

          _this.visibleSnackbar = null;
        }

        _this.show(ONLINE_SNACK);
      });
    }
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
          gap = _configObj$gap === void 0 ? 500 : _configObj$gap;
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


      var snackbar = new Snackbar(name, message, duration);
      /* setting snackbar actions */

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var action = _step.value;
          snackbar.setAction(action);
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

      if (!duration && !actions.length) {
        snackbar.setAction({
          name: 'dismiss'
        });
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

  }, {
    key: "addSnackbarHideEvent",
    value: function addSnackbarHideEvent(snackbar, gap) {
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
  }]);

  return Snackbars;
}();

export default Snackbars;
