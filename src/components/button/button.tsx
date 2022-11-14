import React, { memo } from 'react';

import './styles.css';

interface ButtonProps {
  children: React.ReactNode;
  classes?: string[];
  disabled?: boolean;
  handleClick?: () => void;
  isLink?: boolean;
  isSubmit?: boolean;
  styles?: object;
  title?: string;
}

function Button(props: ButtonProps): React.ReactElement {
  const {
    children,
    classes,
    disabled,
    handleClick,
    isLink,
    isSubmit,
    styles,
    title,
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
      style={{
        ...styles,
      }}
      title={title}
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
  styles: {},
  title: '',
};

export default memo(Button);
