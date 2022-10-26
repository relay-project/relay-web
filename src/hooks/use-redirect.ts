import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTING } from '../router';
import { useAppSelector } from '../store/hooks';

export default function useRedirect(redirectIfAuthorized = false): void {
  const navigate = useNavigate();

  const { token } = useAppSelector((state) => state.user);

  useEffect(
    (): void => {
      if (token) {
        navigate(`/${redirectIfAuthorized ? ROUTING.home : ''}`);
      }
    },
    [],
  );
}
