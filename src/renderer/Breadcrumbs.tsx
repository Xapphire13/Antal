import React from 'react';
import Spacing from './Spacing';
import Text, { Weight } from './Text';
import { withStyles, WithStylesProps } from './themes/withStyles';

export type BreadcrumbsProps = {
  path: string;
  onSelect: (path: string) => void;
} & WithStylesProps;

export function BareBreadcrumbs({
  path,
  css,
  styles,
  theme
}: BreadcrumbsProps) {
  const parts = path.split('/').filter(part => !!part);

  return (
    <div {...css(styles.breadcrumbs)}>
      {parts.map(part => (
        <Spacing key={part} right={1} inline>
          <Text weight={Weight.Bolder} color={theme.color.white} inline>
            {part}
          </Text>
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
