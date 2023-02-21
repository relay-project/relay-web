import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/button';
import { ROUTING } from '../../router';
import { SPACER } from '../../configuration';
import useRedirect from '../../hooks/use-redirect';
import './styles.css';

function Index(): React.ReactElement {
  const navigate = useNavigate();

  useRedirect(true);

  return (
    <div className="f d-col j-center mh-auto ns index">
      <h1 className="t-center title">
        Relay project
      </h1>
      <Button
        classes={['mt-2 mh-auto']}
        handleClick={(): void => navigate(`/${ROUTING.signIn}`)}
        styles={{
          width: `${SPACER * 5}px`,
        }}
      >
        Sign in
      </Button>
      <Button
        classes={['mt-2 mh-auto']}
        handleClick={(): void => navigate(`/${ROUTING.signUp}`)}
        styles={{
          width: `${SPACER * 5}px`,
        }}
      >
        Sign up
      </Button>
    </div>
  );
}

export default memo(Index);
