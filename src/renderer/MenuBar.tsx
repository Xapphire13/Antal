import React from 'react';
import { withStyles, WithStylesProps } from './themes/withStyles';
import WindowControls from './WindowControls';

export type MenuBarProps = {
  children?: React.ReactNode | React.ReactNode[];
} & WithStylesProps;

function BareMenuBar({ children, styles, css }: MenuBarProps) {
  return (
    <div {...css(styles.menuBar)}>
      <div {...css(styles.controls)}>
        <WindowControls />
      </div>
      <div {...css(styles.childrenContainer)}>{children}</div>
    </div>
  );
}

export default withStyles(() => ({
  menuBar: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 40
  },
  controls: {
    flexShrink: 0
  },
  childrenContainer: {
    height: '100%',
    display: 'inline-block',
    overflow: 'hidden'
  }
}))(BareMenuBar);
