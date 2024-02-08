import './tailwind.css';
import React from 'react';
import App from './App/App';
import ReactDOM from 'react-dom/client';
import { MinimodeProvider } from '@context';
import { ModalProvider } from '@context';
import { MenuItem } from './Context/ContextMenuProvider';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <MinimodeProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </MinimodeProvider>
  </React.StrictMode>,
);
