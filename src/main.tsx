import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';

import App from './App';
import {
  persistedStore,
  store,
} from './store';
import Spinner from './components/spinner';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <PersistGate
      loading={(<Spinner />)}
      persistor={persistedStore}
    >
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </PersistGate>
  </Provider>,
);
