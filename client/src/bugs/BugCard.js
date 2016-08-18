import React from 'react';
import moment from 'moment';

import { Header, Image, Button, Label, Icon } from 'stardust';

export default React.createClass({
  contextTypes: {
    'user': React.PropTypes.object,
  },

  render() {
    const { user } = this.context;
    const { bug } = this.props;

    const author = bug.get('createdBy');

    return (
      <div className="card">
        <Image src={`https://api.adorable.io/avatars/260/${bug.id}`} />
        <div className="content">
          <Header.H3>{bug.get('playerName')}</Header.H3>
          <div className="meta">
            <a>Bug id {bug.id}</a>
          </div>
          <div className="description">
            {(() => {
              if (!author) return;

              if (user && (user.id === author.id)) {
                return (
                  <span>Created by <strong>You</strong> (<em>{author.id}</em>)</span>
                );
              } else {
                return (
                  <span>Created by User <em>{author.id}</em></span>
                );
              }
            })()}
          </div>
        </div>

        <div className="extra content">
          <div className="ui button tiny labeled">
            <Button className="mini red">
              <Icon name="bug" />
            </Button>
            <Label className="basic red left pointing label">
              {bug.get('score')}
            </Label>
          </div>

          <span className="right floated">
            {moment(bug.get('createdAt')).fromNow()}
          </span>
        </div>

        <div className="extra content">
          <div className="right floated">
            {(() => {
              const acl = bug.getACL();

              if (acl && !acl.getWriteAccess(user)) {
                return (
                  <Label style={{ 'visibility': 'hidden' }}>not editable</Label>
                );
              }
              return (
                <Label>
                  <Icon name="edit" /> editable
                </Label>
              );
            })()}
          </div>
        </div>

      </div>
    );
  },

});
