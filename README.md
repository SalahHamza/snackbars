# Snackbar

Costume snackbar that works like Snackbars in Android. Controls the multiple snackbars at the same time.

## Installation

First, make sure to include the [snackbar.css file](https://github.com/SalahHamza/snackbar/tree/master/lib/snackbar.css) otherwise the snackbars will not have any styles.

Then install the module from npm:

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

### show(options)

Makes/adds a new snackbar with the specified options to the queue.

#### options.name

Type: `String` Default: `undefined` Required: **yes**

Snackbar name to handle snackbar correctly.

#### options.message

Type: `String` Default: `undefined` Required: **yes**

Message to show in snackbar.

#### options.actions

Type: `Array.<Object>` Default: `undefined` Required: **No**

Snackbar's action buttons.

**Note**: If you don't provide actions or a duration a **dismiss** action will be made for you to hide the snackbar.

##### action.name

Type: `String` Default: `undefined` Required: **Yes**

Placeholder text on the action button.

##### action.handler

Type: `Function` Default: `undefined` Required: **Yes**

a callback function to execute when the action button is clicked.

##### action.dismissOnAction

Type: `Boolean` Default: `true` Required: **No**

If `false` snackbar doesn't disappear when the action is executed.

#### options.duration

Type: `Number` Default: `undefined` Required: **No**

Duration to hide snackbar in milliseconds.

**Note**: If you don't provide actions or a duration a **dismiss** action will be made for you to hide the snackbar.

#### options.gap

Type: `Boolean` Default: `500`(ms) Required: **No**

Gap between showing every snackbar and the other in milliseconds.

## Limitations

* The snackbar element has a `z-index` of `999999`, that means any element on your page with a `z-index` heigher than that might hide the snackbar.

## License

**Snackbars** is a public domain work, dedicated using [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Feel free to do whatever you want with it.