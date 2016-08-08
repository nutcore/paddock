import React from 'react';

import Parse from 'parse';
import hello from 'hellojs';
import { Chance } from 'chance';

import { Container, Message, Form, Input, Button } from 'stardust';

import Signup from './Signup';
import Signin from './Signin';

import moment from 'moment';

const GameScore = Parse.Object.extend("GameScore");

export default React.createClass({
  getInitialState() {
    return {
      'user'    : Parse.User.current(),

      'username': 'username',
      'email'   : '@gmail.com',
      'password': 'password',

      'objects' : [],
      'logs'    : [],
    }
  },

  componentDidMount() {
    var query = new Parse.Query(GameScore);

    query.find()
    .then(
      function(objects) {
        this.success("Successfully retrieved " + objects.length + " scores.");
        this.setState({
          'objects': objects
        });
      }.bind(this),
      function(error) {
        this.error("Error: " + error.code + " " + error.message);
      }.bind(this)
    );
  },

  onChange(key, event) {
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

  onLogin() {
    const { username, email, password } = this.state;

    Parse.User.logIn(username || email, password)
    .then((user) => { this.setState({ 'user': user }); })
    .fail((error) => { this.error(error); });
  },

  onLogout() {
    Parse.User.logOut()
    .then(() => { this.setState({ 'user': undefined }) })
    .fail((error) => { this.error(error); });
  },

  onSocialLogin() {
    var response = hello('twitter').getAuthResponse();

    if (response) {
      // Already logged in
      this.info(response);

      // Create the authData object
      let authData = {
        authData: {
          'auth_token'        : response.oauth_token,
          'auth_token_secret' : response.oauth_token_secret,
          'id'                : response.user_id,
          'screen_name'       : response.screen_name
        }
      }

      // Login the user with the twitter provider
      Parse.User
      .logInWith('twitter', authData)
      .then(
        (user) => {
          this.setState({ 'user': user });
        },
        (error) => {
          this.error(error);
        }
      );
    } else {
      // Login with Twitter
      hello('twitter').login()
      .then(
        (result) => {
          return hello('twitter').api('me');
        },
        (error) => this.error(error)
      )
      .then(
        (profile) => {
          this.info(profile);
          // Then Parse.User.logInWith
        },
        (error) => this.error(error)
      );
    }
  },

  onObjectSave() {
    const { onObjectSaveSuccess, onObjectSaveFailure } = this;

    const gameScore = new GameScore();
    const acl = new Parse.ACL(Parse.User.current());
    acl.setPublicReadAccess(true);
    gameScore.setACL(acl);

    gameScore.save({
      'score'     : chance.integer({min: 0, max: 9000}),
      'playerName': chance.name(),
      'cheatMode' : false,
    }, {
      'success'   : onObjectSaveSuccess,
      'error'     : onObjectSaveFailure
    });
  },

  onObjectSaveSuccess(object) {
    const { objects } = this.state;

    // Execute any logic that should take place after the object is saved.
    this.info('New object created with objectId: ' + object.id);

    this.setState({
      'objects': objects.concat(object),
    });
  },

  onObjectSaveFailure(object, error) {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and message.
    this.error('Failed to create new object, with error code: ' + error.message);
  },

  log(message, level = 'log') {
    const { logs } = this.state;

    this.setState({
      'logs': logs.concat([{ level, message }]),
    });
  },

  info(message) {
    this.log(message, 'info');
  },

  success(message) {
    this.log(message, 'success');
  },

  error(message) {
    this.log(message, 'error');
  },

  render() {
    const { user, username, email, password, objects, logs } = this.state;
    const { onChange, onObjectSave } = this;
    const { onSignup, onLogin, onSocialLogin, onLogout } = this;

    return (
      <section className="ui vertical stripe segment">
        <section className="col-md-6">

          <Container>
            <div className="ui two column middle aligned very relaxed stackable grid">
              <div className="column">
                {(() => {
                  if (user) return;
                  return (
                    <Signup
                      username={username}
                      email={email}
                      password={password}
                      onChange={onChange}
                      onSubmit={onSignup}
                    />
                  );
                })()}
              </div>

              <div className="column">
                {(() => {
                  if (user) return;
                  return (
                    <Signin
                      username={username}
                      email={email}
                      password={password}
                      onChange={onChange}
                      onSubmit={onLogin}
                    />
                  );
                })()}
              </div>
            </div>
          </Container>

          <Container>
            <div className="ui two column middle aligned very relaxed stackable grid" style={{ 'marginBottom': '2em' }}>
              <div className="column">

                <Form className="segment">
                  {(() => {
                    if (user) {
                      return (
                        <Form.Field label={`Logged in as: ${user.id}`}>

                          <Button onClick={onLogout}>
                            <i className="sign out icon"></i>
                            Logout
                          </Button>
                        </Form.Field>
                      );
                    }
                  })()}

                  <Form.Field label='Signin'>
                    <Button className="twitter" onClick={onSocialLogin}>
                      <i className="twitter icon"></i>
                      Signin with Twitter
                    </Button>
                  </Form.Field>
                </Form>

              </div>
            </div>
          </Container>

          <div className="ui container center aligned" style={{ 'marginBottom': '2em' }}>
            <button className="massive ui button" onClick={onObjectSave}>
              <i className="fire icon"></i>
              &raquo; fire something up
            </button>
          </div>

          <div className="ui container cards">
            {(objects.slice().reverse()).map((object, index) => {
              const acl = object.getACL();
              const user = object.get('createdBy');

              return (
                <div className="card" key={object.id}>
                  <div className="image">
                    <img src={`http://lorempixel.com/290/290/${categories[index % 12]}`} />
                  </div>
                  <div className="content">
                    <div className="header">{object.get('playerName')}</div>
                    <div className="meta">
                      <a>id {object.id}</a>
                    </div>
                    <div className="description">
                      Created by user id {`${user ? user.id : null}`}
                    </div>
                  </div>
                  <div className="extra content">
                    <div className="ui labeled button">
                      <div className="mini ui red button">
                        <i className="bug icon"></i>
                      </div>
                      <a className="ui basic red left pointing label">
                        {object.get('score')}
                      </a>
                    </div>

                    <span className="right floated">
                      {moment(object.get('createdAt')).fromNow()}
                    </span>
                  </div>
                  <div className="extra content">
                    <div className="right floated">
                      {(() => {
                        if (acl && acl.getWriteAccess(user)) return (
                          <div className="ui label"><i className="edit icon"></i> editable</div>
                        );
                      })()}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </section>

        <section style={{
          'position'        : 'fixed',
          'top'             : 0,
          'right'           : 0,
          'padding'         : '75px 20px 20px',
          'backgroundColor' : 'rgba(0,0,0,0.1)',
          'width'           : 360,
          'maxWidth'        : 360,
         }}>
          {(() => {
            if (logs.length) {
              return (
                <h2>Logs</h2>
              );
            }
          })()}
          {(logs.slice().reverse()).map((log, index) => {
            return (
              <Message dismissable className={log.level} header={log.level} key={index}>
                {JSON.stringify(log.message)}
              </Message>
            );

          })}
        </section>

      </section>
    );
  },

});

const categories = [
  'abstract',
  'animals',
  'business',
  'cats',
  'city',
  'food',
  // 'night',
  // 'life',
  'fashion',
  'people',
  'nature',
  'sports',
  'technics',
  'transport',
]
