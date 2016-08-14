import React from 'react';
import Parse from 'parse';

import { Container } from 'stardust';

import NavBar from './NavBar';

import './App.css';

export default React.createClass({
  childContextTypes: {
    'user'    : React.PropTypes.object,
    'session' : React.PropTypes.object,
  },

  getInitialState() {
    return {
      'user'    : null,
      'session' : null,
    }
  },

  getChildContext() {
    const { user, session } = this.state;

    return {
      user,
      session,
    };
  },

  componentWillMount() {
    const user = Parse.User.current();
    if (user) {
      // Parse.User.current().fetch() Makes sure that User Session in
      // localStorage will be up to date on refresh (i.e. emailVerified)
      user
        .fetch()
        .then(
          this.onUserFetchSuccess,
          this.onUserFetchFailure
        );
    }
  },

  onUserFetchSuccess(user) {
    // TODO ParseError { code: 101 }
    // Parse.Session.current().then(
    //   this.onSessionFetchSuccess,
    //   this.onSessionFetchFailure
    // );

    this.setState({
      user,
    });
  },

  onUserFetchFailure(/*error*/) {
    this.setState({
      'user': undefined,
    });
  },

  onSessionFetchSuccess(session) {
    this.setState({
      session,
    });
  },

  onSessionFetchFailure(/*error*/) {
    this.setState({
      'session': undefined,
    });
  },

  render() {
    return (
      <section>
        <NavBar />

        <Container className="mt6">
          {this.props.children}
        </Container>

      </section>
    );
  },

});
