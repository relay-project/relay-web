import React, { memo } from 'react';

interface HomeLayoutProps {
  handleCompleteLogout: () => void;
  handleLogout: () => void;
}

function HomeLayout(props: HomeLayoutProps): React.ReactElement {
  const {
    handleCompleteLogout,
    handleLogout,
  } = props;

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

export default memo(HomeLayout);
