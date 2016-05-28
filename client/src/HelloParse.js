const GameScore = Parse.Object.extend("GameScore");

const HelloParse = React.createClass({
  getInitialState() {
    return {
      'user'    : undefined,

      'username': 'username',
      'password': 'password',

      'objects' : [],
    }
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
    const { username, password } = this.state;

    Parse.User.signUp(username, password)
    .then((results) => { console.log(results); })
    .fail((error) => { console.log(error); });
  },

  onLogin() {
    const { username, password } = this.state;

    Parse.User.logIn(username, password)
    .then((results) => { this.setState({ 'user': results }); })
    .fail((error) => { console.log(error); });
  },

  onSocialLogin() {
    var response = hello('twitter').getAuthResponse();

    if (response) {
      // Already logged in
      console.log(response);

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
          console.log(error);
        }
      );
    } else {
      // Login with Twitter
      hello('twitter')
      .login()
      .then(
        (result) => {
          return hello('twitter').api('me');
        },
        (error) => console.error(error)
      )
      .then(
        (profile) => {
          console.log(profile);
          // Then Parse.User.logInWith
        },
        (error) => console.error(error)
      );
    }
  },

  onObjectSave() {
    const { onObjectSaveSuccess, onObjectSaveFailure } = this;

    console.info("Current User", Parse.User.current());
    const gameScore = new GameScore();

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
    console.info('New object created with objectId: ' + object.id);

    this.setState({
      'objects': objects.concat(object.toJSON())
    });
  },

  onObjectSaveFailure(object, error) {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and message.
    console.error('Failed to create new object, with error code: ' + error.message);
  },

  render() {
    const { user, username, password, objects } = this.state;
    const { onChange, onObjectSave } = this;
    const { onSignup, onLogin, onSocialLogin } = this;

    return (
      <section>
        <h1>Hello, Parse!</h1>
        <form>
          <div>
            <input type="text"      placeholder="username" value={username} onChange={(e) => onChange('username', e)} />
            <input type="password"  placeholder="password" value={password} onChange={(e) => onChange('password', e)} />
            <button style={{ 'cursor': 'pointer' }} onClick={onSignup}>Signup</button>
          </div>

          <div>
            <input type="text"      placeholder="username" value={username} onChange={(e) => onChange('username', e)} />
            <input type="password"  placeholder="password" value={password} onChange={(e) => onChange('password', e)} />
            <button style={{ 'cursor': 'pointer' }} onClick={onLogin}>Login</button>
          </div>
        </form>

        <div>
          {(() => {
            if (user) {
              return (
                <div>
                  Logged in as:
                  {' '}
                  {user.id}
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
          {(objects).map((object) => {
            return (
              <li key={object.objectId}>
                <div>ID: {object.objectId}</div>
                <div>Name: {object.playerName}</div>
                <div>Score: {object.score}</div>
                <div>Created at: {object.createdAt}</div>
              </li>
            );
          })}
        </ul>
      </section>
    );
  },

});

ReactDOM.render(
  <HelloParse />,
  document.getElementById('example')
);
