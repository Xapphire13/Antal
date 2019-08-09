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
  theme: typeof defaultTheme;
};

type StyleMap = { [key: string]: StyleMap | CSSProperties };

export const withStyles: (
  params: (params: typeof defaultTheme) => StyleMap
) => <TProps>(
  wrapped: React.ComponentType<TProps>
) => React.ComponentType<Omit<TProps, keyof WithStylesProps>> = _withStyles;

export { css, ThemedStyleSheet };
