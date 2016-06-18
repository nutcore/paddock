const GameScore = Parse.Object.extend("GameScore");

const HelloParse = React.createClass({
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
      "score": chance.integer({min: 0, max: 9000}),
      "playerName": chance.name(),
      "cheatMode": false,
    }, {
      success: onObjectSaveSuccess,
      error: onObjectSaveFailure
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
      <section className="row">
        <section className="col-md-6">
          <h1>Hello, Parse!</h1>
          <div>
            <div>
              <input type="text"      placeholder="username" value={username} onChange={(e) => onChange('username', e)} />
              <input type="text"      placeholder="email"    value={email}    onChange={(e) => onChange('email', e)} />
              <input type="password"  placeholder="password" value={password} onChange={(e) => onChange('password', e)} />
              <button style={{ 'cursor': 'pointer' }} onClick={onSignup}>Signup</button>
            </div>

            <div>
              <input type="text"      placeholder="username" value={username} onChange={(e) => onChange('username', e)} />
              <input type="text"      placeholder="email"    value={email}    onChange={(e) => onChange('email', e)} />
              <input type="password"  placeholder="password" value={password} onChange={(e) => onChange('password', e)} />
              <button style={{ 'cursor': 'pointer' }} onClick={onLogin}>Login</button>
            </div>
          </div>

          <div>
            {(() => {
              if (user) {
                return (
                  <div>
                    Logged in as: {user.id}
                    <button style={{ 'cursor': 'pointer' }} onClick={onLogout}>Logout</button>
                  </div>
                );
              }
            })()}
          </div>

          <div>
            <button onClick={onSocialLogin}>Twitter</button>
          </div>
          <h3 style={{ 'cursor': 'pointer' }} onClick={onObjectSave}> &raquo; fire something up </h3>

          <ul>
            {(objects.slice().reverse()).map((object) => {
              const acl = object.getACL();
              const user = object.get('createdBy');
              return (
                <li key={object.id}>
                  <div>ID: {object.id}</div>
                  <div>Name: {object.get('playerName')}</div>
                  <div>Score: {object.get('score')}</div>
                  <div>Created at: {`${object.get('createdAt')}`}</div>
                  <div>Created by: {`${user ? user.id : null}`}</div>
                  <div>editable: {`${acl ? acl.getWriteAccess(user) : false}`}</div>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="col-md-6">
          {(() => {
            if (logs.length) {
              return (
                <h2>Logs</h2>
              );
            }
          })()}
          <ul>
            {(logs.slice().reverse()).map((log, index) => {
              return (
                <li key={index}>
                  <div>{log.level}: {JSON.stringify(log.message)}</div>
                </li>
              );
            })}
          </ul>
        </section>
      </section>
    );
  },

});

ReactDOM.render(
  <HelloParse />,
  document.getElementById('example')
);
