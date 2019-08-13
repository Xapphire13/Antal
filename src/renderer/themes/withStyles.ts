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

type StyleMap = {
  [key: string]:
    | CSSProperties
    | {
        [psuedoSelectorOrMediaQuery: string]:
          | CSSProperties
          | CSSProperties[keyof CSSProperties];
      };
};

export type WithStylesProps = {
  css: Function;
  styles: any;
  theme: typeof defaultTheme;
};

export const withStyles: (
  params: (params: typeof defaultTheme) => StyleMap
) => <TProps>(
  wrapped: React.ComponentType<TProps>
) => React.ComponentType<Omit<TProps, keyof WithStylesProps>> = _withStyles;

export { css, ThemedStyleSheet };
