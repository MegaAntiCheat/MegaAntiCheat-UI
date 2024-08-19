import './tailwind.css';
import React from 'react';
import App from './App/App';
import ReactDOM from 'react-dom/client';
import { MinimodeProvider, ModalProvider } from './Context';
import { SideMenuProvider } from './Context/SideMenuContext';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <MinimodeProvider>
      <ModalProvider>
        <SideMenuProvider>
          <App />
        </SideMenuProvider>
      </ModalProvider>
    </MinimodeProvider>
  </React.StrictMode>,
);
