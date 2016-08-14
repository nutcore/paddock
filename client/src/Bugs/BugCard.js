import React from 'react';
import moment from 'moment';

import { Header, Image, Button, Label, Icon } from 'stardust';

export default React.createClass({
  render() {
    const { bug } = this.props;

    const user = bug.get('createdBy');

    return (
      <div className="card">
        <Image src={`https://api.adorable.io/avatars/260/${bug.id}`} />
        <div className="content">
          <Header.H3>{bug.get('playerName')}</Header.H3>
          <div className="meta">
            <a>id {bug.id}</a>
          </div>
          <div className="description">
            Created by user id {`${user ? user.id : null}`}
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

        {/* TODO ACL
          <div className="extra content">
            <div className="right floated">
              {(() => {
                const acl = bug.getACL();

                if (acl && !acl.getWriteAccess(user)) return;
                return (
                  <Label>
                    <Icon name="edit" /> editable
                  </Label>
                );
              })()}
            </div>
          </div>
        */}

      </div>
    );
  },

});
