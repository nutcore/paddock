import React from 'react';
import { render } from 'react-dom';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';

import Parse from 'parse';
import hello from 'hellojs';

import App from './App';
import BugsView from './bugs/BugsView';

import Signin from './user/Signin';
import Signup from './user/Signup';
import Reset from './user/Reset';
import Profile from './user/Profile';

import 'semantic-ui-css/semantic.css'
import 'semantic-ui-css/semantic'

// Check `docker-machine's IP || 192.168.99.100 || 0.0.0.0` if you have trouble connecting
let CLIENT_HOSTNAME = window.location.hostname;
let CLIENT_PORT     = window.location.port;
let SERVER_URL;
let SERVER_PORT;
let APP_ID;
let JS_KEY;
let TWITTER_KEY;

if (ENV === 'production') {
    // SERVER_PORT = 80
    SERVER_URL  = `//${CLIENT_HOSTNAME}/parse`;
    APP_ID      = 'paddock';
    // JS_KEY
    TWITTER_KEY = 'iVFMEZwJEwzLWAty9jXbzHQdL';
} else {
    SERVER_PORT = 1337;
    SERVER_URL  = `//${CLIENT_HOSTNAME}:${SERVER_PORT}/parse`;
    APP_ID      = 'APPLICATION_ID';
    JS_KEY      = 'YOUR_JAVASCRIPT_KEY';
    TWITTER_KEY = 'iVFMEZwJEwzLWAty9jXbzHQdL';
}

Parse.initialize(APP_ID, JS_KEY);
Parse.serverURL = SERVER_URL;

hello.init(
  { 'twitter'     : TWITTER_KEY },
  {
    'redirect_uri': `//${CLIENT_HOSTNAME}${CLIENT_PORT ? `:${CLIENT_PORT}` : ''}/redirect.html`,
    'oauth_proxy' : `//${CLIENT_HOSTNAME}${SERVER_PORT ? `:${SERVER_PORT}` : ''}/oauthproxy`,
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
      <Route path="*"           component={App} />
    </Router>
  ),
  document.querySelector('#app')
);
