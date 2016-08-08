import React from 'react';
import { render } from 'react-dom';

import Parse from 'parse';
import hello from 'hellojs';

import App from './App';

import 'stardust/node_modules/semantic-ui-css/semantic.css'
import 'stardust/node_modules/semantic-ui-css/semantic'

// Check docker-machine's IP || 192.168.99.100 if you have trouble connecting
const hostname = window.location.hostname;

Parse.initialize("APPLICATION_ID", "YOUR_JAVASCRIPT_KEY");
Parse.serverURL = `//${hostname}:1337/parse`;

hello.init(
  { 'twitter' : '6X6ry6vsVDHflO7zII7iJlMvr' },
  {
    'redirect_uri': `http://${hostname}:8080/redirect.html`,
    'oauth_proxy' : `http://${hostname}:1337/oauthproxy`,
  }
);

render(
  <App/>,
  document.querySelector('#app')
);
