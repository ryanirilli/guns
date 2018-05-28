import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import dotEnv from 'dotenv';
import registerServiceWorker from './registerServiceWorker';

dotEnv.config();
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
