import React, { useState } from 'react';
// @ts-ignore
import X from 'react-feather/dist/icons/x';
// @ts-ignore
import Minimize from 'react-feather/dist/icons/minus';
// @ts-ignore
import Maximize from 'react-feather/dist/icons/maximize-2';
import Spacing from './Spacing';
import { withStyles, WithStylesProps } from './themes/withStyles';

type ButtonProps = {
  color: 'red' | 'yellow' | 'green';
  icon: React.ReactElement;
  visible?: boolean;
} & WithStylesProps;

function BareButton({ css, styles, color, icon, visible }: ButtonProps) {
  return (
    <div {...css(styles.button, styles[color])}>
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
  },
  // eslint-disable-next-line react-with-styles/no-unused-styles
  red: {
    background: '#ED6A5F'
  },
  // eslint-disable-next-line react-with-styles/no-unused-styles
  yellow: {
    background: '#F6BE4F'
  },
  // eslint-disable-next-line react-with-styles/no-unused-styles
  green: {
    background: '#62C655'
  }
}))(BareButton);

type WindowControlsProps = {
  inline?: boolean;
} & WithStylesProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function BareWindowControls({ css, styles, inline }: WindowControlsProps) {
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
        <Button color="red" icon={<X size={8} />} visible={hover} />
        <Spacing horizontal={1} inline>
          <Button color="yellow" icon={<Minimize size={8} />} visible={hover} />
        </Spacing>
        <Button color="green" icon={<Maximize size={8} />} visible={hover} />
      </Spacing>
    </div>
  );
}

export default withStyles(() => ({
  inline: {
    display: 'inline-block'
  }
}))(BareWindowControls);
