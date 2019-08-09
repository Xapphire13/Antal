import React from 'react';
import KeyCode from 'keycode-js';
import Spacing from './Spacing';
import Text, { Weight } from './Text';
import { withStyles, WithStylesProps } from './themes/withStyles';

type BreadcrumbProps = {
  title: string;
  onClick(): void;
  onKeyPress(event: React.KeyboardEvent): void;
} & WithStylesProps;

function BareBreadcrumb({
  onClick,
  onKeyPress,
  title,
  theme,
  css,
  styles
}: BreadcrumbProps) {
  return (
    <div
      {...css(styles.breadcrumb)}
      onClick={onClick}
      onKeyPress={onKeyPress}
      role="button"
      tabIndex={0}
    >
      <Spacing right={1} inline>
        <Text weight={Weight.Bolder} color={theme.color.white} inline>
          {title}
        </Text>
      </Spacing>
    </div>
  );
}

const Breadcrumb = withStyles(() => ({
  breadcrumb: {
    ':hover': {
      cursor: 'pointer'
    }
  }
}))(BareBreadcrumb);

export type BreadcrumbsProps = {
  path: string;
  onSelect: (path: string) => void;
} & WithStylesProps;

export function BareBreadcrumbs({
  path,
  css,
  styles,
  onSelect
}: BreadcrumbsProps) {
  const parts = path.split('/').filter(part => !!part);

  return (
    <div {...css(styles.breadcrumbs)}>
      {parts.map((part, index) => {
        const onClick = () => onSelect(parts.slice(0, index).join('/'));
        const onKeyPress = (ev: React.KeyboardEvent) => {
          if (
            ev.charCode === KeyCode.KEY_RETURN ||
            ev.charCode === KeyCode.KEY_ENTER
          ) {
            ev.preventDefault();
            onClick();
          }
        };

        return (
          <Breadcrumb
            key={part}
            onKeyPress={onKeyPress}
            onClick={onClick}
            title={part}
          />
        );
      })}
    </div>
  );
}

export default withStyles(({ color }) => ({
  breadcrumbs: {
    background: color.darkGray
  }
}))(BareBreadcrumbs);
