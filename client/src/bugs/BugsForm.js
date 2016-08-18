import React from 'react';
import { Chance } from 'chance';

import { Segment, Container, Header, Message, Image, Form, Input, Button, Icon } from 'stardust';

import BugCard from './BugCard';

export default React.createClass({
  getInitialState() {
    const { user } = this.context;

    // Prefill
    return {
      'score'     : chance.integer({ 'min': 0, 'max': 9000 }),
      'playerName': chance.name(),
    }
  },

  onChange(event, key) {
    this.setState(
      Object.defineProperty(
        {},
        key,
        {
          'enumerable': true,
          'value'     : event.target.value,
        }
      )
    );
  },

  onSubmit() {
    const { score, playerName } = this.state;
    const { onObjectSave } = this.props;

    onObjectSave({
      score,
      playerName
    });

    // Prefill again
    this.setState({
      'score'     : chance.integer({ 'min': 0, 'max': 9000 }),
      'playerName': chance.name(),
    });
  },

  render() {
    const { score, playerName } = this.state;
    const { onChange, onSubmit } = this;

    return (
      <Segment style={{ 'margin': '0.5em 0.5em 2em' }}>
        <Container>

          <Image className="left floated" style={{ 'width': 145 }} src={`https://api.adorable.io/avatars/145/`} />

          <Form>
            <Header.H5>
              <Icon name="bug" rotated="clockwise" />
              Create a Bug Score
            </Header.H5>

            <Form.Fields evenlyDivided>
              <Form.Field label='Intern Name'>
                <Input
                  placeholder='Intern Name' name='playerName' type='text' value={playerName}
                  onChange={(e) => onChange(e, 'playerName')}
                />
              </Form.Field>
              <Form.Field label='Score'>
                <Input
                  placeholder='9000' name='score' type='number' value={score}
                  onChange={(e) => onChange(e, 'score')}
                />
              </Form.Field>
            </Form.Fields>

            <Form.Fields>
              <Form.Field>
                <Button className="medium" onClick={onSubmit}>
                  <Icon name="bug" rotated="counterclockwise" />
                  Submit
                </Button>
              </Form.Field>
            </Form.Fields>

          </Form>

        </Container>
      </Segment>
    );
  },

});
