import React, { CSSProperties } from 'react';
import { withStyles, WithStylesProps } from './themes/withStyles';

export type SpacingProps = {
  children: React.ReactElement | string;

  inline?: boolean;
  horizontal?: number;
  vertical?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
} & WithStylesProps;

export function BareSpacing({
  bottom,
  horizontal,
  inline,
  left,
  right,
  top,
  vertical,
  children,
  styles,
  css,
  theme
}: SpacingProps) {
  const { unit } = theme;
  const computedLeft = horizontal || left;
  const computedRight = horizontal || right;
  const computedTop = vertical || top;
  const computedBottom = vertical || bottom;

  const computedStyles: CSSProperties = {
    marginTop: (computedTop || 0) * unit,
    marginBottom: (computedBottom || 0) * unit,
    marginLeft: (computedLeft || 0) * unit,
    marginRight: (computedRight || 0) * unit
  };

  return (
    <div {...css(computedStyles, inline && styles.inline)}>{children}</div>
  );
}

export default withStyles(() => ({
  inline: {
    display: 'inline-block'
  }
}))(BareSpacing);
