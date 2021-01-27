import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { VeramoProvider } from './lib/veramo-react'
import { defaultAgent } from './setup'

ReactDOM.render(
  <React.StrictMode>
    <VeramoProvider agent={defaultAgent}>
      <App />
    </VeramoProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
