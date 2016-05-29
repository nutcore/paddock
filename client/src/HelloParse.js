const GameScore = Parse.Object.extend("GameScore");

const HelloParse = React.createClass({
  getInitialState() {
    return {
      'user'    : Parse.User.current(),

      'username': 'username',
      'password': 'password',

      'objects' : [],
    }
  },

  componentDidMount() {
    var query = new Parse.Query(GameScore);

    query.find()
    .then(
      function(objects) {
        console.log("Successfully retrieved " + objects.length + " scores.");
        this.setState({
          'objects': objects
        });
      }.bind(this),
      function(error) {
        console.log("Error: " + error.code + " " + error.message);
      }
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
    const { username, password } = this.state;

    Parse.User.signUp(username, password)
    .then((response) => { console.log(response); })
    .fail((error) => { console.log(error); });
  },

  onLogin() {
    const { username, password } = this.state;

    Parse.User.logIn(username, password)
    .then((user) => { this.setState({ 'user': user }); })
    .fail((error) => { console.log(error); });
  },

  onLogout() {
    Parse.User.logOut()
    .then(() => { this.setState({ 'user': undefined }) })
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
    console.info('New object created with objectId: ' + object.id);

    this.setState({
      'objects': objects.concat(object)
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
    const { onSignup, onLogin, onSocialLogin, onLogout } = this;

    return (
      <section>
        <h1>Hello, Parse!</h1>
        <div>
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
          {(objects.reverse()).map((object) => {
            const acl = object.getACL();
            return (
              <li key={object.id}>
                <div>ID: {object.id}</div>
                <div>Name: {object.get('playerName')}</div>
                <div>Score: {object.get('score')}</div>
                <div>Created at: {`${object.get('createdAt')}`}</div>
                <div>editable: {`${acl ? acl.getWriteAccess(user) : false}`}</div>
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
