import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/button';

function NotFound(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <h1 className="noselect">
        Page not found!
      </h1>
      <Button
        classes={['mt-2']}
        handleClick={(): void => navigate(-1)}
      >
        Back
      </Button>
    </div>
  );
}

export default memo(NotFound);
