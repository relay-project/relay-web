import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import delay from '../../utilities/delay';
import { deleteUserData } from '../../store/features/user.slice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

function Home(): React.ReactElement {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { token } = useAppSelector((state) => state.user);

  const handleCompleteLogout = async (): Promise<void> => {
    await delay();
    console.log(token);
  };

  const handleLogout = async (): Promise<void> => {
    dispatch(deleteUserData());
    await delay();
    return navigate('/');
  };

  return (
    <div className="flex direction-column">
      <h1>
        Home
      </h1>
      <button
        className="mt-1"
        onClick={handleLogout}
        type="button"
      >
        Logout
      </button>
      <button
        className="mt-1"
        onClick={handleCompleteLogout}
        type="button"
      >
        Complete logout
      </button>
    </div>
  );
}

export default memo(Home);
