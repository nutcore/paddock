import React from 'react';
import Parse from 'parse';
import hello from 'hellojs';

import logger from '../common/logger';
import Logs from '../common/Logs';

import { Container, Grid, Segment, Form, Input, Message, Button, Icon } from 'stardust';

const TABS = {
  'profile'   : 1,
}

export default React.createClass({
  getInitialState() {
    // TODO Browsable tabs
    const { tab } = this.props.params;

    return {
      'selected': TABS[tab || 'profile'],
      'logs'    : [],
    }
  },

  contextTypes: {
    'router'  : React.PropTypes.object.isRequired,
    'user'    : React.PropTypes.object,
    'session' : React.PropTypes.object,
  },

  log: logger.log,
  info: logger.info,
  success: logger.success,
  error: logger.error,

  onLogout() {
    const { router } = this.context;

    Parse.User.logOut()
    .then(() => {
      // if twitter
      hello('twitter')
        .logout()
        .then(
          this.onLogoutSuccess,
          this.onLogoutFailure
        );
    })
    .fail((error) => { this.error(error); });
  },

  onLogoutSuccess() {
    // Force load from root, for context refresh
    window.location.href = "/";
  },

  onLogoutFailure(/*error*/) {
    // There was no Twitter session to remove
    this.onLogoutSuccess();
  },

  render() {
    const { onLogout } = this;
    const { router, user, session } = this.context;
    const { selected } = this.state;

    if (!user) {
      return (
        null
      );
    }

    const { logs } = this.state;
    const message = logs[logs.length -1];

    const authData = user && user.get('authData');
    const isFromTwitter = authData && authData.twitter;
    const isVerified = user && (isFromTwitter || user.get('emailVerified'));
    const twitter = isFromTwitter ? authData.twitter.screen_name : false;

    return (
      <Container>
        <Grid stackable reversed="mobile" columns={2}>
          <Grid.Column width={12}>
            {(() => {
              if (!message) return;
              return (
                <Message className={message.level} header={message.level}>
                  {JSON.stringify(message.message)}
                </Message>
              );
            })()}

            <Segment>
              <Form>
                <Form.Field label="Parse User id">
                  <Input value={user.id} disabled />
                </Form.Field>

                {(() => {
                  if (twitter) return;
                  return (
                    <Form.Field label={`Email (${isVerified ? '' : 'not'} verified)`}>
                      <Input value={user.get('email')} disabled />
                    </Form.Field>
                  );
                })()}
                {(() => {
                  if (!twitter) return;
                  return (
                    <Form.Field label="Twitter handle">
                      <Input value={`@${twitter}`} disabled />
                    </Form.Field>
                  );
                })()}

              </Form>
            </Segment>

          </Grid.Column>
          <Grid.Column width={4}>
            <div className="ui fluid vertical menu">
              <a className={`item ${selected === TABS['profile'] ? 'active teal' : ''}`}
                  onClick={() => { router.push('/profile'); this.setState({ selected: TABS['profile'] }); }}
              >
                <Icon name="user" />
                Profile
              </a>
              <a className="item" onClick={onLogout}>
                Sign out
                <Icon name="sign out" />
              </a>

          </div>
          </Grid.Column>
        </Grid>
      </Container>
    );
  },

});
