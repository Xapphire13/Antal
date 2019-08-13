import React from 'react';
import { useDrag } from 'react-use-gesture';
// eslint-disable-next-line import/no-extraneous-dependencies
import { remote } from 'electron';
import { withStyles, WithStylesProps } from './themes/withStyles';
import WindowControls from './WindowControls';

export type MenuBarProps = {
  children?: React.ReactNode | React.ReactNode[];
} & WithStylesProps;

function closeWindow() {
  remote.getCurrentWindow().close();
}

function minimizeWindow() {
  remote.getCurrentWindow().minimize();
}

function toggleWindowMaximized() {
  const win = remote.getCurrentWindow();

  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
}

function BareMenuBar({ children, styles, css }: MenuBarProps) {
  const bindDrag = useDrag(({ down, delta }) => {
    const win = remote.getCurrentWindow();

    if (down) {
      const [x, y] = delta;
      const [xPos, yPos] = win.getPosition();
      win.setPosition(xPos + x, yPos + y);
    }
  });

  return (
    <div {...css(styles.menuBar)} {...bindDrag()}>
      <div {...css(styles.controls)}>
        <WindowControls
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={toggleWindowMaximized}
        />
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
