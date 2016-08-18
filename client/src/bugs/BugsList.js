import React from 'react';

import { Container } from 'stardust';

import BugCard from './BugCard';

export default React.createClass({
  render() {
    const { bugs } = this.props;

    return (
      <Container className="four doubling cards">
        {(bugs).map((bug) => {
          return (
            <BugCard bug={bug} key={bug.id} />
          );
        })}
      </Container>
    );
  },

});
