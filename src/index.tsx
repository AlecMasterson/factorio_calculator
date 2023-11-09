// @ts-ignore
import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import Store from './Store';
import Main from './Main';
import './index.css';

createRoot(document.getElementById('root')).render(
  <Provider store={Store}>
    <Main />
  </Provider>
);
