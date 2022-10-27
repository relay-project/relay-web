import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Home from '../pages/home';
import IndexPage from '../pages/index';
import NotFoundPage from '../pages/not-found';
import Recovery from '../pages/recovery';
import SignIn from '../pages/sign-in';
import SignUp from '../pages/sign-up';

export const ROUTING = {
  home: 'home',
  recovery: 'recovery',
  signIn: 'sign-in',
  signUp: 'sign-up',
};

export default createBrowserRouter([
  {
    element: <Home />,
    path: `/${ROUTING.home}`,
  },
  {
    element: <IndexPage />,
    path: '/',
  },
  {
    element: <Recovery />,
    path: `/${ROUTING.recovery}`,
  },
  {
    element: <SignIn />,
    path: `/${ROUTING.signIn}`,
  },
  {
    element: <SignUp />,
    path: `/${ROUTING.signUp}`,
  },
  {
    element: <NotFoundPage />,
    path: '*',
  },
]);
