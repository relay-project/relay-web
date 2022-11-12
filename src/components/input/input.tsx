import React, { memo } from 'react';

import './styles.css';

interface InputProps {
  classes?: string[];
  disabled?: boolean;
  handleInput: (event: React.FormEvent<HTMLInputElement>) => void;
  name: string;
  placeholder?: string;
  styles?: object;
  type?: string;
  value: number | string;
}

function Input(props: InputProps): React.ReactElement {
  const {
    classes = [],
    disabled = false,
    handleInput,
    name,
    placeholder = '',
    styles = {},
    type = 'text',
    value,
  } = props;

  const additionalClasses = classes.join(' ');

  return (
    <input
      className={`input ${additionalClasses}`}
      disabled={disabled}
      name={name}
      onChange={handleInput}
      placeholder={placeholder}
      style={{
        ...styles,
      }}
      type={type}
      value={value}
    />
  );
}

Input.defaultProps = {
  classes: [],
  disabled: false,
  placeholder: '',
  styles: {},
  type: 'text',
};

export default memo(Input);
