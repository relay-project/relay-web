import React, { memo } from 'react';

import './styles.css';

interface ButtonProps {
  children: React.ReactNode;
  classes?: string[];
  disabled?: boolean;
  handleClick?: () => void;
  isLink?: boolean;
  isSubmit?: boolean;
}

function Button(props: ButtonProps): React.ReactElement {
  const {
    children,
    classes,
    disabled,
    handleClick,
    isLink,
    isSubmit,
  } = props;

  const classesString = classes && classes.length > 0
    ? classes.join(' ')
    : '';

  const onClick = (): null | void => {
    if (!isSubmit && handleClick) {
      return handleClick();
    }
    return null;
  };

  return (
    <button
      className={`${isLink ? 'link' : 'button'} noselect ${classesString}`}
      disabled={disabled}
      onClick={onClick}
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
  handleClick: null,
  isLink: false,
  isSubmit: false,
};

export default memo(Button);
