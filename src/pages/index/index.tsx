import React, { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTING } from '../../router';
import { useAppSelector } from '../../store/hooks';

function Index(): React.ReactElement {
  const navigate = useNavigate();

  const userData = useAppSelector((state) => state.user);

  useEffect(
    (): void => {
      if (userData.id && userData.token) {
        navigate(`/${ROUTING.home}`);
      }
    },
    [],
  );

  return (
    <div className="App">
      <h1>
        Relay project
      </h1>
      <button
        onClick={(): void => navigate(`/${ROUTING.signIn}`)}
        type="button"
      >
        Sign in
      </button>
      <button
        onClick={(): void => navigate(`/${ROUTING.signUp}`)}
        type="button"
      >
        Sign up
      </button>
    </div>
  );
}

export default memo(Index);
