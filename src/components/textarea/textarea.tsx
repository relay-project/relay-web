import React, { memo } from 'react';

import './styles.css';

interface TextareaProps {
  classes?: string[];
  disabled?: boolean;
  handleInput: (event: React.FormEvent<HTMLTextAreaElement>) => void;
  name: string;
  placeholder?: string;
  value: number | string;
}

function Textarea(props: TextareaProps): React.ReactElement {
  const {
    classes = [],
    disabled = false,
    handleInput,
    name,
    placeholder = '',
    value,
  } = props;

  const additionalStyles = classes.join(' ');

  return (
    <textarea
      className={`textarea ${additionalStyles}`}
      disabled={disabled}
      name={name}
      onChange={handleInput}
      placeholder={placeholder}
      value={value}
    />
  );
}

Textarea.defaultProps = {
  classes: [],
  disabled: false,
  placeholder: '',
};

export default memo(Textarea);
