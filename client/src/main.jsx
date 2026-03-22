import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <MantineProvider defaultColorScheme="auto">
    <App />
  </MantineProvider>
);
