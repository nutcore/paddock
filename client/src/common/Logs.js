import React from 'react';

import { Message } from 'stardust';

export default React.createClass({
  render() {
    const { logs } = this.props;

    return (
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
    );
  },

});
