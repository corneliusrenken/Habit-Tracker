import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalStyling from './globalStyling';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const theme = {
  primary: '#000',
  secondary: '#CED0C3',
  tertiary: '#CC4445',
  background: '#fff',
};

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyling />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
