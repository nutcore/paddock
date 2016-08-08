import React from 'react';

import { Form, Input, Button } from 'stardust';

export default React.createClass({
  render() {
    const { username, email, password } = this.props;
    const { onChange, onSubmit } = this.props;

    return (
      <Form className="segment">
        <Form.Field label="username">
          <Input placeholder="username" value={username} onChange={(e) => onChange('username', e)} />
        </Form.Field>
        <Form.Field label="email">
          <Input placeholder="email" value={email} onChange={(e) => onChange('email', e)} />
        </Form.Field>
        <Form.Field label="password">
          <Input type="password" placeholder="password" value={password} onChange={(e) => onChange('password', e)} />
        </Form.Field>

        <Button type="submit" className="blue" onClick={onSubmit}>
          <i className="signup icon"></i>
          Signup
        </Button>
      </Form>
    );
  },

});
