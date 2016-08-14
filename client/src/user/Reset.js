import React from 'react';
import ReactDOM from 'react-dom';
import Parse from 'parse';

import { Container, Segment, Form, Message, Header, Input, Button, Icon } from 'stardust';

const fields = {
  'email'   : 'email',
}

import logger from '../common/logger';
import Logs from '../common/Logs';

export default React.createClass({
  getInitialState() {
    const { location } = this.props;

    let email;
    if (location && location.state) {
      email = location.state.email;
    }

    return {
      'valid'   : true,

      'email'   : email || '',

      'logs'    : [],
    }
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

  onReset(e) {
    e.preventDefault();

    const { email } = this.state;

    Parse.User
      .requestPasswordReset(
        email, {
          success: this.onResetSuccess,
          error  : this.onResetFailure,
      });
  },

  onResetSuccess() {
    this.success({
      'type'    : 'success',
      'message' : 'We sent you a mail with a link to reset the password',
    });
  },

  onResetFailure(error) {
    console.log(this);
    this.error(error);
  },

  render() {
    const { onChange } = this;
    const { onValid, onInvalid } = this;
    const { onReset } = this;
    const { valid, email, logs } = this.state;

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

          <Form fields={fields} on='blur' inline onValid={onValid} onInvalid={onInvalid} onSuccess={onReset}>
            <Header.H2>
              Reset your password
            </Header.H2>

            <Form.Field label="Email">
              <Input type="text" placeholder="email" name="email" value={email} onChange={(e) => onChange(e, 'email')} ref="email" />
            </Form.Field>

            <Button type="submit" className="teal fluid" disabled={!valid}>
              <Icon name="privacy" />
              Reset
            </Button>
          </Form>

        </Segment>

        <Logs logs={logs} />

      </Container>
    );
  },

});
