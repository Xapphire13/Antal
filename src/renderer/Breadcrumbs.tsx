import React from 'react';
import KeyCode from 'keycode-js';
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
  theme,
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
          <div
            onClick={onClick}
            onKeyPress={onKeyPress}
            role="button"
            tabIndex={0}
          >
            <Spacing key={part} right={1} inline>
              <Text weight={Weight.Bolder} color={theme.color.white} inline>
                {part}
              </Text>
            </Spacing>
          </div>
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
