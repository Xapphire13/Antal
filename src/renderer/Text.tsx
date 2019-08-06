import React from 'react';
import { withStyles, WithStylesProps } from './themes/withStyles';

export type TextLike = string | Text;

export enum Size {
  Regular
}

export enum Weight {
  Regular,
  Bolder
}

export type TextProps = {
  children: TextLike;
  inline?: boolean;
  /** Default: 'inherit' */
  color?: string;
  size?: Size;
  weight?: Weight;
} & WithStylesProps;

export function BareText({
  inline,
  children,
  color = 'inherit',
  css,
  styles,
  weight
}: TextProps) {
  return (
    <div
      {...css(
        { color },
        weight === Weight.Bolder && styles.bolder,
        inline && styles.inline
      )}
    >
      {children}
    </div>
  );
}

export default withStyles(() => ({
  bolder: {
    fontWeight: 'bold'
  },
  inline: {
    display: 'inline-block'
  }
}))(BareText);
