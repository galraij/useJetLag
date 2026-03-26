import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import App from './App';
import { TravelProvider } from './context/TravelContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <MantineProvider defaultColorScheme="auto">
    <TravelProvider>
      <App />
    </TravelProvider>
  </MantineProvider>
);
