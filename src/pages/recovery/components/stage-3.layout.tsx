import React, { memo } from 'react';

import Button from '../../../components/button';
import { ROUTING } from '../../../router';
import '../styles.css';

interface Stage3LayoutProps {
  handleNavigate: (destination: string) => void;
}

function Stage3Layout(props: Stage3LayoutProps): React.ReactElement {
  const { handleNavigate } = props;

  return (
    <>
      <div className="success-title mt-1 noselect">
        Account recovery completed!
      </div>
      <div className="success-text mt-1 text-center noselect">
        You can now sign into your account using your new password!
      </div>
      <Button
        classes={['button-positive', 'mt-2']}
        handleClick={(): void => handleNavigate(`/${ROUTING.signIn}`)}
      >
        Sign in
      </Button>
      <Button
        classes={['mt-1']}
        handleClick={(): void => handleNavigate('back')}
        isLink
      >
        Back
      </Button>
    </>
  );
}

export default memo(Stage3Layout);
