import React from 'react';
import { render } from 'react-dom';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';

import Parse from 'parse';
import hello from 'hellojs';

import App from './App';
import BugsView from './Bugs/BugsView';

import Signin from './User/Signin';
import Signup from './User/Signup';
import Reset from './User/Reset';
import Profile from './User/Profile';

import 'stardust/node_modules/semantic-ui-css/semantic.css'
import 'stardust/node_modules/semantic-ui-css/semantic'

// Check docker-machine's IP || 192.168.99.100 if you have trouble connecting
const hostname = window.location.hostname;

Parse.initialize("APPLICATION_ID", "YOUR_JAVASCRIPT_KEY");
Parse.serverURL = `//${hostname}:1337/parse`;

hello.init(
  { 'twitter' : 'iVFMEZwJEwzLWAty9jXbzHQdL' },
  {
    'redirect_uri': `http://${hostname}:8080/redirect.html`,
    'oauth_proxy' : `http://${hostname}:1337/oauthproxy`,
  }
);

render(
  (
    <Router history={browserHistory}>
      <Route path="/"           component={App}>
        <IndexRoute             component={BugsView} />
        <Route path="/signin"   component={Signin} />
        <Route path="/signup"   component={Signup} />
        <Route path="/reset"    component={Reset} />
        <Route path="/profile"  component={Profile} />
      </Route>
      <Route path="*"         component={App} />
    </Router>
  ),
  document.querySelector('#app')
);
