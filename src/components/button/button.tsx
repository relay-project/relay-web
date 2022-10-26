import React, { memo } from 'react';

import './styles.css';

interface ButtonProps {
  children: React.ReactNode;
  classes?: string[];
  disabled?: boolean;
  isSubmit?: boolean;
  onClick?: () => void;
}

function Button(props: ButtonProps): React.ReactElement {
  const {
    children,
    classes,
    disabled,
    isSubmit,
    onClick,
  } = props;

  const classesString = classes && classes.length > 0
    ? classes.join(' ')
    : '';

  return (
    <button
      className={`button noselect ${classesString}`}
      disabled={disabled}
      onClick={
        isSubmit
          ? onClick
          : (): null => null
      }
      type={
        isSubmit
          ? 'submit'
          : 'button'
      }
    >
      { children }
    </button>
  );
}

Button.defaultProps = {
  classes: [],
  disabled: false,
  isSubmit: false,
  onClick: null,
};

export default memo(Button);
