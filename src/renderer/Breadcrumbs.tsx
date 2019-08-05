import React from 'react';
import Spacing from './Spacing';
import { withStyles, WithStylesProps } from './themes/withStyles';

export type BreadcrumbsProps = {
  path: string;
  onSelect: (path: string) => void;
} & WithStylesProps;

export function BareBreadcrumbs({ path, css, styles }: BreadcrumbsProps) {
  const parts = path.split('/').filter(part => !!part);

  return (
    <div {...css(styles.breadcrumbs)}>
      {parts.map(part => (
        <Spacing key={part} right={1} inline>
          {part}
        </Spacing>
      ))}
    </div>
  );
}

export default withStyles(({ color }) => ({
  breadcrumbs: {
    background: color.darkGray
  }
}))(BareBreadcrumbs);
