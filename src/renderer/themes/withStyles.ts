// @ts-ignore
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
// @ts-ignore
import aphroditeInterface from 'react-with-styles-interface-aphrodite';
// @ts-ignore
import { css, withStyles } from 'react-with-styles';

import theme from './defaultTheme';

ThemedStyleSheet.registerTheme(theme);
ThemedStyleSheet.registerInterface(aphroditeInterface);

export type WithStylesProps = {
  css: Function;
  styles: any;
};

export { css, withStyles, ThemedStyleSheet };
