import React, { memo } from 'react';

import './styles.css';

interface InputProps {
  classes?: string[];
  disabled?: boolean;
  handleInput: (event: React.FormEvent<HTMLInputElement>) => void;
  loading?: boolean;
  name: string;
  placeholder?: string;
  styles?: object;
  type?: string;
  value: number | string;
  withSpinner?: boolean;
}

function Input(props: InputProps): React.ReactElement {
  const {
    classes = [],
    disabled = false,
    handleInput,
    loading = false,
    name,
    placeholder = '',
    styles = {},
    type = 'text',
    value,
    withSpinner = false,
  } = props;

  const additionalClasses = classes.join(' ');

  return (
    <div className={`${withSpinner ? 'with-spinner' : ''}`}>
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
      { withSpinner && loading && (
        <span className="spinner" />
      ) }
    </div>
  );
}

Input.defaultProps = {
  classes: [],
  disabled: false,
  loading: false,
  placeholder: '',
  styles: {},
  type: 'text',
  withSpinner: false,
};

export default memo(Input);
