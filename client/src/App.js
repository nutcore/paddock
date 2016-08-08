import React from 'react';

import NavBar from './NavBar';
import HelloParse from './HelloParse';

import './App.css';

export default React.createClass({
  render() {
    return (
      <section>
        <div className="pusher">
          <div className="ui inverted vertical masthead center aligned segment">
            <div className="ui text container">
              <h1 className="ui inverted header">
                Hello Parse!
              </h1>
              <h2>meet me, I'm paddock</h2>
            </div>

          </div>
        </div>

        {/*<NavBar />*/}
        <HelloParse />

      </section>
    );
  },

});
