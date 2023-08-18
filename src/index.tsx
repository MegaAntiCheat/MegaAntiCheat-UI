import './tailwind.css';
import React from 'react';
import App from './App/App';
import ReactDOM from 'react-dom/client';
import { MinimodeProvider } from './Context/MinimodeContext';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <MinimodeProvider>
      <App />
    </MinimodeProvider>
  </React.StrictMode>,
);
