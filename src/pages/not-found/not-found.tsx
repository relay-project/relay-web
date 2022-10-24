import React, { memo } from 'react';

function NotFound(): React.ReactElement {
  return (
    <div>
      <h1>
        Page not found!
      </h1>
    </div>
  );
}

export default memo(NotFound);
