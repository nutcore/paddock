import React from 'react';

import Parse from 'parse';

export default React.createClass({
  onLogout() {
    const { router } = this.context;

    Parse.User.logOut()
    .then(() => { router.push('/'); })
    .fail((error) => { console.error(error); });
  },

  render() {
    const { onLogout } = this;
    const user = Parse.User.current();

    return (
      <div className="ui inverted large top fixed hidden menu">

        <div className="ui container">
          <a href="/" className="item"></a>
          <div className="right menu">
            {(() => {
              if (user) {
                return (
                  <a className="item" href="/profile">
                    <i className="user icon"></i>
                    Profile
                  </a>
                );
              }
            })()}

            {(() => {
              if (user) {
                return (
                  null
                );
              }
              return (
                <div className="item">
                  <a className="ui button primary" href="/login">
                    Sign in
                  </a>
                </div>
              );
            })()}

          </div>
        </div>

      </div>
    );
  },

});
