import React, { memo } from 'react';

import './styles.css';

interface ModalWrapProps {
  children: React.ReactNode;
}

function ModalWrap(props: ModalWrapProps): React.ReactElement {
  const { children } = props;

  return (
    <div
      className="flex align-items-center justify-center modal-wrap"
    >
      { children }
    </div>
  );
}

export default memo(ModalWrap);
