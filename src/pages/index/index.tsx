import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTING } from '../../router';

function Index(): React.ReactElement {
  const navigate = useNavigate();

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
