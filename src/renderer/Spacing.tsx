import React from 'react';
import theme from './themes/defaultTheme';

export type SpacingProps = {
  children: React.ReactElement | string;

  inline?: boolean;
  horizontal?: number;
  vertical?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
};

export default function Spacing({
  bottom,
  horizontal,
  inline,
  left,
  right,
  top,
  vertical,
  children
}: SpacingProps) {
  const Tag = inline ? 'span' : 'div';

  if (horizontal != null) {
    left = horizontal;
    right = horizontal;
  }

  if (vertical != null) {
    top = vertical;
    bottom = vertical;
  }

  const { unit } = theme;

  return (
    <Tag
      style={{
        marginTop: (top || 0) * unit,
        marginBottom: (bottom || 0) * unit,
        marginLeft: (left || 0) * unit,
        marginRight: (right || 0) * unit
      }}
    >
      {children}
    </Tag>
  );
}
