import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import  {} from './index.css';
import App from './App';
import { AppState } from './app_state';

const appState = new AppState();
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App appState = {appState} />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);


