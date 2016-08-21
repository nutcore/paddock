import React from 'react';

import { Message } from 'stardust';

export default React.createClass({
  getInitialState() {
    return {
      'hidden': [],
    };
  },

  onDismiss(index) {
    const hidden = (this.state.hidden).concat([index]);
    this.setState({ hidden });
  },

  render() {
    const { hidden } = this.state;
    const { logs } = this.props;
    
    const length = logs.length;

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
          if (length) {
            return (
              <h2>Logs</h2>
            );
          }
        })()}
        {(logs.slice().reverse()).map((log, i) => {
          const index = length - i;

          if (hidden.indexOf(index) > -1) return;
          return (
            <Message
              key={index}
              className={log.level}
              header={log.level}
              content={JSON.stringify(log.message + ' ' + index)}
              onDismiss={() => this.onDismiss(index)}
            />
          );

        })}
      </section>
    );
  },

});
