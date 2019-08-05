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

export function Text({
  inline,
  children,
  color = 'inherit',
  css,
  styles,
  weight
}: TextProps) {
  const Tag = inline ? 'span' : 'div';

  return (
    // eslint-disable-next-line react-with-styles/only-spread-css
    <Tag {...css(weight === Weight.Bolder && styles.bolder)} style={{ color }}>
      {children}
    </Tag>
  );
}

export default withStyles(() => ({
  bolder: {
    fontWeight: 'bold'
  }
}))(Text);
