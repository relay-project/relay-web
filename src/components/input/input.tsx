import React, { memo } from 'react';

import './styles.css';

interface InputProps {
  classes?: string[];
  disabled?: boolean;
  handleInput: (event: React.FormEvent<HTMLInputElement>) => void;
  name: string;
  placeholder?: string;
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
    type = 'text',
    value,
  } = props;

  const additionalStyles = classes.join(' ');

  return (
    <input
      className={`input ${additionalStyles}`}
      disabled={disabled}
      name={name}
      onChange={handleInput}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  );
}

Input.defaultProps = {
  classes: [],
  disabled: false,
  placeholder: '',
  type: 'text',
};

export default memo(Input);
