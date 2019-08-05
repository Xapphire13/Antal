import React, { CSSProperties } from 'react';
// @ts-ignore
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
// @ts-ignore
import aphroditeInterface from 'react-with-styles-interface-aphrodite';
// @ts-ignore
// eslint-disable-next-line no-restricted-imports
import { css, withStyles as _withStyles } from 'react-with-styles';

import defaultTheme from './defaultTheme';

ThemedStyleSheet.registerTheme(defaultTheme);
ThemedStyleSheet.registerInterface(aphroditeInterface);

export type WithStylesProps = {
  css: Function;
  styles: any;
};

/* eslint-disable @typescript-eslint/indent */
export const withStyles: (
  params: (params: typeof defaultTheme) => { [key: string]: CSSProperties }
) => <TProps>(
  wrapped: React.ComponentClass<TProps, any> | React.FunctionComponent<TProps>
) => React.StatelessComponent<
  Omit<Omit<TProps, 'styles'>, 'css'>
> = _withStyles;
/* eslint-enable @typescript-eslint/indent */

export { css, ThemedStyleSheet };
