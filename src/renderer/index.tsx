import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const body = document.getElementsByTagName('body')[0];
const appRoot = document.createElement('div');
appRoot.id = 'app-root';
body.appendChild(appRoot);

ReactDOM.render(<App />, appRoot);
