import React, { useState, CSSProperties } from 'react';
// @ts-ignore
import X from 'react-feather/dist/icons/x';
// @ts-ignore
import Minimize from 'react-feather/dist/icons/minus';
// @ts-ignore
import Maximize from 'react-feather/dist/icons/maximize-2';
import color from 'color';
import Spacing from './Spacing';
import { withStyles, WithStylesProps } from './themes/withStyles';
import onEnter from './onEnter';

const GREEN = '#62C655';
const YELLOW = '#F6BE4F';
const RED = '#ED6A5F';

function getColor(buttonColor: ButtonProps['color']) {
  if (buttonColor === 'red') {
    return RED;
  }
  if (buttonColor === 'yellow') {
    return YELLOW;
  }

  return GREEN;
}

type ButtonProps = {
  color: 'red' | 'yellow' | 'green';
  icon: React.ReactElement;
  onClick?: () => void;
  visible?: boolean;
} & WithStylesProps;

function BareButton({
  onClick,
  css,
  styles,
  color: buttonColor,
  icon,
  visible
}: ButtonProps) {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const buttonColorCode = getColor(buttonColor);
  const colorStyle: CSSProperties = {
    background: buttonColorCode
  };

  if (isMouseDown) {
    colorStyle.background = color(buttonColorCode)
      .lighten(0.4)
      .hex();
  }

  return (
    <div
      {...css(styles.button, colorStyle)}
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onClick={onClick}
      onKeyPress={onClick && onEnter(onClick)}
      role="button"
      tabIndex={0}
    >
      <div {...css(styles.icon, visible && styles.visible)}>{icon}</div>
    </div>
  );
}

const Button = withStyles(() => ({
  button: {
    position: 'relative',
    display: 'inline-block',
    width: 12,
    height: 12,
    borderRadius: 6
  },
  icon: {
    position: 'absolute',
    top: -5.5,
    left: 2,
    visibility: 'hidden'
  },
  visible: {
    visibility: 'visible'
  }
}))(BareButton);

type WindowControlsProps = {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  inline?: boolean;
} & WithStylesProps;

function BareWindowControls({
  onClose,
  onMaximize,
  onMinimize,
  css,
  styles,
  inline
}: WindowControlsProps) {
  const [hover, setHover] = useState(false);

  return (
    <div
      {...css(inline && styles.inline)}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <Spacing vertical={1} horizontal={1}>
        <Button
          color="red"
          icon={<X size={8} />}
          visible={hover}
          onClick={onClose}
        />
        <Spacing horizontal={1} inline>
          <Button
            color="yellow"
            icon={<Minimize size={8} />}
            visible={hover}
            onClick={onMinimize}
          />
        </Spacing>
        <Button
          color="green"
          icon={<Maximize size={8} />}
          visible={hover}
          onClick={onMaximize}
        />
      </Spacing>
    </div>
  );
}

export default withStyles(() => ({
  inline: {
    display: 'inline-block'
  }
}))(BareWindowControls);
