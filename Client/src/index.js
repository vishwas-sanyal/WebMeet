import React from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

import App from './App';
import { ContextProvider } from './SocketContext';
import './styles.css';

// ReactDOM.render(<App />, document.getElementById('root'));
const container = document.getElementById('root');
const root = createRoot(container); // create a root
root.render(
    <ContextProvider><App /></ContextProvider>
); // render app to the root