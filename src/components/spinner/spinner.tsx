import React, { memo } from 'react';

import './styles.css';

function Spinner(): React.ReactElement {
  return (
    <div className="spinner-background">
      <div className="flex align-items-center justify-center spinner-content">
        Loading...
      </div>
    </div>
  );
}

export default memo(Spinner);
