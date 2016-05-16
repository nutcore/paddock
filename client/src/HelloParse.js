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

  render() {
    const { user, username, password, objects } = this.state;
    const { onChange } = this;

    return (
      <div>
        <h1>Hello, world!</h1>
        <div>
          <input type="text"      placeholder="username" value={username} onChange={(e) => onChange('username', e)} />
          <input type="password"  placeholder="password" value={password} onChange={(e) => onChange('password', e)} />
          <button style={{ 'cursor': 'pointer' }} onClick={() => {
            Parse.User.signUp('username', 'password')
            .then((results) => { console.log(results); })
            .fail((error) => { console.log(error); });
          }}>Signup</button>
        </div>

        <div>
          <input type="text"      placeholder="username" value={username} onChange={(e) => onChange('username', e)} />
          <input type="password"  placeholder="password" value={password} onChange={(e) => onChange('password', e)} />
          <button style={{ 'cursor': 'pointer' }} onClick={() => {
            Parse.User.logIn('username', 'password')
            .then((results) => { this.setState({ 'user': results }); })
            .fail((error) => { console.log(error); });
          }}>Login</button>
        </div>
        <div>
          {(() => {
            if (user) {
              return (
                <div>
                  Logged in:
                  {' '}
                  {user.id}
                </div>
              );
            }
          })()}
        </div>
        <div>
          <button onClick={(e) => {
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
          }}>Twitter</button>
        </div>
        <h3 style={{ 'cursor': 'pointer' }} onClick={() => {
          console.log(Parse.User.current());
          const gameScore = new GameScore();

          gameScore.set("score", chance.integer({min: 0, max: 9000}));
          gameScore.set("playerName", chance.name());
          gameScore.set("cheatMode", false);

          gameScore.save(null, {
            success: (gameScore) => {
              // Execute any logic that should take place after the object is saved.
              console.info('New object created with objectId: ' + gameScore.id);
              this.setState({
                'objects': objects.concat(gameScore.toJSON())
              });
            }.bind(this),
            error: (gameScore, error) => {
              // Execute any logic that should take place if the save fails.
              // error is a Parse.Error with an error code and message.
              console.error('Failed to create new object, with error code: ' + error.message);
            }
          });
        }}> &raquo; fire something up </h3>

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
      </div>
    );
  },

});

ReactDOM.render(
  <HelloParse />,
  document.getElementById('example')
);
