# Snackbar

Costume snackbar that works like Snackbars in Android. Controls the multiple snackbars at the same time.

## Installation

First, make sure to include the [snackbar.css file](https://github.com/SalahHamza/snackbar/tree/master/lib/snackbar.css)

```bash
npm install @salahhamza/snackbars --save
```

## Usage

```js
import Snackbars from '@salahhamza/snackbars';

const snackbars = new Snackbars(document.body);

snackbars.show({
  name: 'update',
  message: 'New version available. Refresh to update',
  actions: [{
    name: 'refresh',
    handler() {
      window.location.reload();
    },
    textColor: '#00FF00'
  }, {
    name: 'dismiss'
  }]
});
```

## API

### Snackbars(container[, makeCustomeOfflineSnackbar])

Constructor, takes 2 parameters:
* **`container`**: the DOM element to which the snackbars are appended to. defaults to `document.body`.
* **`makeCustomeOfflineSnackbar`**: makes **offline** that show up when there is no interne access (hides when internet access is back) and **online** snackbar that show up when internet is back up. defaults to `false`.

#### show(options)

Makes/adds a new snackbar with the specified options to the queue.

##### options (Object)
{name, message, actions = [], duration, gap = 500}

* **name** (required): `String` - snackbar name to handle snackbar correctly.
* **message** (required): `String` - message to show in snackbar.
* **actions**: `Array.<Object>` - actions to do when their respective button is clicked.
  - **name** (required): `String` - Placeholder text on the action button.
  - **handler**: `Function` - a callback function to execute when the action button is clicked.
  - **dismissOnAction**: `Boolean` - If `false` snackbar doesn't disappear when the action is executed. defaults to `true`.
* **duration**: `Number` - Duration to hide snackbars in milliseconds.
* **gap**: `Number` - gap between every snackbar and the other in milliseconds. defaults to **500** milliseconds.

**Note**: If you don't provide actions or a duration a **dismiss** action will be made for you to hide the snackbar.