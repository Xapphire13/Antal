import React from 'react';

export type SpacingProps = {
  children: React.ElementType | string;

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

  return (
    <Tag
      style={{
        marginTop: (top || 0) * 8,
        marginBottom: (bottom || 0) * 8,
        marginLeft: (left || 0) * 8,
        marginRight: (right || 0) * 8
      }}
    >
      {children}
    </Tag>
  );
}
