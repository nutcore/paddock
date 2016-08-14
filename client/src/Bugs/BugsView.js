import React from 'react';
import Parse from 'parse';
import { Chance } from 'chance';

const BugScore = Parse.Object.extend("BugScore");

import { Container, Message, Form, Input, Button, Icon } from 'stardust';

import BugsList from './BugsList';

import logger from '../common/logger';
import Logs from '../common/Logs';

export default React.createClass({
  getInitialState() {
    const { user } = this.context;

    return {
      'user'    : user,

      'objects' : [],
      'logs'    : [],
    }
  },

  contextTypes: {
    'user': React.PropTypes.object,
  },

  log: logger.log,
  info: logger.info,
  success: logger.success,
  error: logger.error,

  componentDidMount() {
    var query = new Parse.Query(BugScore);

    query.descending("createdAt")
    .limit(12)
    .find()
    .then(
      (objects) => {
        this.setState({ objects });
        this.success(`Successfully retrieved ${objects.length} scores.`);
      },
      (error) => {
        this.error(`Error: ${error.code} ${error.message}`);
      }
    );
  },

  onObjectSave() {
    const { user } = this.context;
    const { onObjectSaveSuccess, onObjectSaveFailure } = this;

    const bugScore = new BugScore();

    bugScore.save({
      'score'     : chance.integer({ 'min': 0, 'max': 9000 }),
      'playerName': chance.name(),
    }, {
      // Execute any logic that should take place after the object is saved.
      'success'   : onObjectSaveSuccess,
      // Execute any logic that should take place if the save fails.
      'error'     : onObjectSaveFailure
    });
  },

  onObjectSaveSuccess(object) {
    const { objects } = this.state;

    this.setState({ 'objects': [object].concat(objects) });
    this.info(`New object created with objectId: ${object.id}`);
  },

  onObjectSaveFailure(object, error) {
    // error is a Parse.Error with an error code and message.
    this.error(`Failed to create new object, with error code: ${error.message}`);
  },

  render() {
    const { user } = this.context;
    const { objects, logs } = this.state;

    const { onObjectSave } = this;

    return (
      <section className="ui vertical stripe segment">
        <section className="col-md-6">

          <Container className="center aligned" style={{ 'marginBottom': '2em' }}>
            <button className="massive ui button" onClick={onObjectSave}>
              <Icon name="bug" />
              bug something up
            </button>
          </Container>

          <BugsList bugs={objects} />
        </section>

        <Logs logs={logs} />

      </section>
    );
  },

});
