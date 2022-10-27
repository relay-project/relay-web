import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/button';
import { ROUTING } from '../../router';
import useRedirect from '../../hooks/use-redirect';
import './styles.css';

function Index(): React.ReactElement {
  const navigate = useNavigate();

  useRedirect(true);

  return (
    <div className="flex direction-column centered align-items-center justify-center">
      <h1 className="title noselect">
        Relay project
      </h1>
      <Button
        classes={['mt-2']}
        handleClick={(): void => navigate(`/${ROUTING.signIn}`)}
      >
        Sign in
      </Button>
      <Button
        classes={['mt-2']}
        handleClick={(): void => navigate(`/${ROUTING.signUp}`)}
      >
        Sign up
      </Button>
    </div>
  );
}

export default memo(Index);
