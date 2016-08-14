import React from 'react';
import ReactDOM from 'react-dom';
import Parse from 'parse';

import { Container, Segment, Header, Form, Message, Input, Button, Icon } from 'stardust';

const fields = {
  'email'   : 'email',
  'password': [ 'empty', 'minLength[6]', 'maxLength[20]' ],
  'confirm' : ['match[password]', 'empty', 'minLength[6]', 'maxLength[20]' ],
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
      'confirm' : '',

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

  onSignup() {
    const { username, email, password } = this.state;

    const user = new Parse.User();
    user.set({
      'username': username || email,
    }).set({
      email
    }).set({
      password
    }).signUp()
    .then((response) => {
      this.success(response);
      this.setState({
        'user': Parse.User.current(),
      });
    })
    .fail((error) => { this.error(error); });
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

  onSignin(e) {
    const { router } = this.context;

    e.preventDefault();
    router.push({
      'pathname': '/signin',
      'state'   : this.state,
    });
  },

  render() {
    const { onChange, onSignup } = this;
    const { onValid, onInvalid } = this;
    const { onSignin } = this;
    const { router } = this.context;
    const { valid, user, username, email, password, confirm, logs } = this.state;

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
          <Form fields={fields} on='blur' inline onValid={onValid} onInvalid={onInvalid}>

            <Header.H2>
              Create your account
            </Header.H2>

            <Form.Field label="Email" style={{ 'position': 'relative' }}>
              <Input type="text" placeholder="email" name="email" value={email} onChange={(e) => onChange(e, 'email')} ref="email" />
            </Form.Field>

            <Form.Field label="Password">
              <Input type="password" placeholder="password" name="password" value={password} onChange={(e) => onChange(e, 'password')} />
            </Form.Field>

            <Form.Field label="Confirm Password">
              <Input type="password" placeholder="password" name="confirm" value={confirm} onChange={(e) => onChange(e, 'confirm')} />
            </Form.Field>

            <Button type="submit" className="teal fluid" onClick={onSignup} disabled={!valid}>
              <Icon name="sign up" />
              Sign up
            </Button>

          </Form>
        </Segment>

        <Segment className="center aligned">
          Already have an account?
          <br />
          <a href="/signin" onClick={onSignin}>
            <strong>Sign in</strong>
          </a>
        </Segment>

        <Logs logs={logs} />

      </Container>
    );
  },

});
