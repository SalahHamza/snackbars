const container = '.snackbar{opacity:0;position:fixed;z-index:3;bottom:0;left:0;\
                      right:0;background-color:rgba(0,0,0,0.877);padding:14px 0 14px 24px;\
                      box-sizing:border-box;display:flex;transition:opacity 0.3s ease;}\
                      /* media query */\
                      @media screen and (min-width:624px){.snackbar{bottom:16px;left:24px;\
                      width:fit-content;border-radius:2px;min-width:300px;max-width:600px}}';

const message = '.snackbar .message{flex:1;color:white;margin:0 48px 0 0}';

const buttons = '.snackbut{margin:0 24px 0 0;float:right;color:tomato;\
                    text-transform:uppercase;background-color:transparent;\
                    border:0;letter-spacing:1px;cursor:pointer;}';

const snackbarStyles = {
  container,
  message,
  buttons
}

export default snackbarStyles;