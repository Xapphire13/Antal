import { KEY_ENTER, KEY_RETURN } from 'keycode-js';

export default function onEnter(handler: (ev: React.KeyboardEvent) => void) {
  return (ev: React.KeyboardEvent) => {
    if (ev.keyCode === KEY_ENTER || ev.keyCode === KEY_RETURN) {
      handler(ev);
    }
  };
}
