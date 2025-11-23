import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './dark-theme.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

/*
Remove initial dark-theme class to allow default light blue theme from index.css to be applied
*/
// document.body.classList.add('dark-theme');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
