import React from 'react';
import KeyCode from 'keycode-js';
import Spacing from './Spacing';
import Text from './Text';
import { withStyles, WithStylesProps } from './themes/withStyles';

type BreadcrumbProps = {
  title: string;
  onClick(): void;
  onKeyPress(event: React.KeyboardEvent): void;

  first?: boolean;
  last?: boolean;
} & WithStylesProps;

function BareBreadcrumb({
  onClick,
  onKeyPress,
  title,
  theme,
  css,
  styles,
  first,
  last
}: BreadcrumbProps) {
  return (
    <div
      {...css(styles.breadcrumb, !first && styles.notFirst)}
      onClick={onClick}
      onKeyPress={onKeyPress}
      role="button"
      tabIndex={0}
    >
      {!first && <div {...css(styles.pointer, styles.pointerBefore)} />}
      <div {...css(styles.content, first && styles.first, last && styles.last)}>
        <Spacing left={first ? 1 : undefined} right={1}>
          <Text color={theme.color.white}>{title}</Text>
        </Spacing>
      </div>
      {!last && <div {...css(styles.pointer, styles.pointerAfter)} />}
    </div>
  );
}

const Breadcrumb = withStyles(({ unit }) => ({
  breadcrumb: {
    display: 'inline-block',
    verticalAlign: 'top',
    position: 'relative',
    height: 40,
    marginTop: 0.5 * unit,
    marginBottom: 0.5 * unit,
    ':hover': {
      cursor: 'pointer'
    }
  },
  content: {
    background: '#3498db',
    height: '100%',
    width: '100%',
    lineHeight: '40px'
  },
  pointer: {
    position: 'absolute',
    border: '0 solid #3498db',
    borderWidth: '20px 10px',
    width: 0,
    height: 0,
    top: 0
  },
  pointerBefore: {
    left: -20,
    borderLeftColor: 'transparent'
  },
  pointerAfter: {
    right: -20,
    borderColor: 'transparent',
    borderLeftColor: '#3498db'
  },
  first: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4
  },
  last: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4
  },
  notFirst: {
    marginLeft: 23
  }
}))(BareBreadcrumb);

export type BreadcrumbsProps = {
  path: string;
  onSelect: (path: string) => void;
  inline?: boolean;
} & WithStylesProps;

export function BareBreadcrumbs({
  path,
  css,
  styles,
  onSelect,
  inline
}: BreadcrumbsProps) {
  const parts = path.split('/').filter(part => !!part);

  return (
    <div {...css(styles.breadcrumbs, inline && styles.inline)}>
      <Spacing vertical={-0.5}>
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
              first={index === 0}
              last={index === parts.length - 1}
            />
          );
        })}
      </Spacing>
    </div>
  );
}

export default withStyles(({ color }) => ({
  breadcrumbs: {
    background: color.darkGray
  },
  inline: {
    display: 'inline-block'
  }
}))(BareBreadcrumbs);
