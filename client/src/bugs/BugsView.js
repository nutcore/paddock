import React from 'react';
import Parse from 'parse';

const BugScore = Parse.Object.extend("BugScore");

import BugsForm from './BugsForm';
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

  onObjectSave(object) {
    const { user } = this.context;
    const { onObjectSaveSuccess, onObjectSaveFailure } = this;

    const bugScore = new BugScore();

    bugScore.save(
      object, {
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
        <BugsForm onObjectSave={onObjectSave} />

        <BugsList bugs={objects} />

        <Logs logs={logs} />

      </section>
    );
  },

});
