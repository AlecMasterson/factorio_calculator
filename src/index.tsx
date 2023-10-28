import React from 'react';
import ReactDOM from 'react-dom/client';
import Store from './Store';
import {Provider} from 'react-redux';
import Main from './Main.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={Store}>
    <Main />
  </Provider>
);
