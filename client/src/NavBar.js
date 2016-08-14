import React from 'react';
import { IndexLink, Link } from 'react-router';

import { Container, Image, Icon } from 'stardust';

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

        <Container>
          <IndexLink className="item" to={`/`}>
            <Image src="/paddock.png" style={{ 'width': 32 }} />
          </IndexLink>
          <div className="right menu">
            {(() => {
              if (user) {
                return (
                  <Link className="item" to={`/profile`}>
                    <Icon name="user" />
                    Profile
                  </Link>
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
                  <Link className="mini ui button primary" to={`/signin`} style={{ 'padding': '8px 14px' }}>
                    Sign in
                  </Link>
                </div>
              );
            })()}

          </div>
        </Container>

      </div>
    );
  },

});
