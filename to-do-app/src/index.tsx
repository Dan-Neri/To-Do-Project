/**
 * This is the main TypeScript file for the front end UI. It uses React
 * and ChakraUI to inject and render the components it will use. 
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider, createStandaloneToast } from '@chakra-ui/react';

const { ToastContainer } = createStandaloneToast();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ChakraProvider>
            <App />
        </ChakraProvider>
        <ToastContainer />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
