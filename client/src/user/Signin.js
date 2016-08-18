import React from 'react';
import ReactDOM from 'react-dom';
import Parse from 'parse';
import hello from 'hellojs';

import { Container, Segment, Header, Form, Message, Input, Button, Icon } from 'stardust';

const fields = {
  'email'   : 'email',
  'password': [ 'empty', 'minLength[6]', 'maxLength[20]' ],
}

import logger from '../common/logger';
import Logs from '../common/Logs';

export default React.createClass({
  getInitialState() {
    const { location } = this.props;

    let email, password;
    if (location && location.state) {
      email = location.state.email;
      password = location.state.password;
    }

    return {
      'valid'   : true,

      'email'   : email || '',
      'password': password || '',

      'logs'    : [],
    }
  },

  contextTypes: {
    'router': React.PropTypes.object.isRequired,
  },

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.email).children[0].focus();
  },

  log: logger.log,
  info: logger.info,
  success: logger.success,
  error: logger.error,

  onChange(event, key) {
    this.setState(
      Object.defineProperty(
        {},
        key,
        {
          'enumerable': true,
          'value'     : event.target.value,
        }
      )
    );
  },

  onLogin(e) {
    e.preventDefault();

    const { router } = this.context;
    const { username, email, password } = this.state;

    Parse.User
      .logIn(username || email, password)
      .then(this.onLoginSuccess)
      .fail(this.onLoginFailure);
  },

  onSocialLogin(e) {
    e.preventDefault();

    const { onTwitterLogin } = this;

    const response = hello('twitter').getAuthResponse();
    if (response) {
      // Already logged in
      // Login the user with the twitter provider
      onTwitterLogin(response);
    } else {
      // Login with Twitter
      hello('twitter').login()
      .then(
        (response) => { onTwitterLogin(response.authResponse); },
        (error) => {
          this.error(error);
        }
      );
    }
  },

  onTwitterLogin(response) {
    const { router } = this.context;

    // Create the authData object
    const authData = {
      authData: {
        'auth_token'        : response.oauth_token,
        'auth_token_secret' : response.oauth_token_secret,
        'id'                : response.user_id,
        'screen_name'       : response.screen_name
      }
    }

    Parse.User
      .logInWith('twitter', authData)
      .then(
        this.onLoginSuccess,
        this.onLoginFailure
      );
  },

  onLoginSuccess() {
    // Force load from root, for context refresh
    window.location.href = "/";
  },

  onLoginFailure(error) {
    this.error(error);
  },

  onValid() {
    this.setState({
      'valid': true,
    });
  },

  onInvalid() {
    this.setState({
      'valid': false,
    });
  },

  onSignup(e) {
    const { router } = this.context;

    e.preventDefault();
    router.push({
      'pathname': '/signup',
      'state'   : this.state,
    });
  },

  onReset(e) {
    const { router } = this.context;

    e.preventDefault();
    router.push({
      'pathname': '/reset',
      'state'   : this.state,
    });
  },

  render() {
    const { onChange, onLogin, onSocialLogin } = this;
    const { onValid, onInvalid } = this;
    const { onSignup, onReset } = this;

    const { valid, user, username, email, password, logs } = this.state;
    const message = logs[logs.length -1];

    return (
      <Container style={{'width': 450}}>
        {(() => {
          if (!message) return;
          return (
            <Message className={message.level} header={message.level}>
              {JSON.stringify(message.message)}
            </Message>
          );
        })()}

        <Segment>
          <Form fields={fields} on='submit' inline onValid={onValid} onInvalid={onInvalid} onSuccess={onLogin}>
            <Header.H2>
              Sign in
            </Header.H2>

            <Form.Field label="Email" style={{ 'position': 'relative' }}>
              <a href="/reset"
                style={{ 'position': 'absolute', 'top': 0, 'right': 0 }}
                onClick={onReset}
              > (Need help?)</a>
              <Input type="text" placeholder="email" name="email" value={email} onChange={(e) => onChange(e, 'email')} ref="email" />
            </Form.Field>

            <Form.Field label="Password">
              <Input type="password" placeholder="password" name="password" value={password} onChange={(e) => onChange(e, 'password')} />
            </Form.Field>

            <Button type="submit" className="teal fluid" onClick={onLogin} disabled={!valid}>
              <Icon name="sign in" />
              Sign in
            </Button>

          </Form>

          <Header.H4 className="horizontal divider">
            <Icon name="cloud" />
            Or with
          </Header.H4>

          <Container className="center aligned">

            <Button className="twitter fluid" onClick={onSocialLogin}>
              <Icon name="twitter" />
              Twitter
            </Button>

          </Container>
        </Segment>

        <Segment className="center aligned">
          Don't have an account?
          <br />
          <a href="/signup" onClick={onSignup}>
            <strong>Create account</strong>
          </a>
        </Segment>

        <Logs logs={logs} />

      </Container>
    );
  },

});
