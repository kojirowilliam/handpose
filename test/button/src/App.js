import React, {Component} from 'react';
import {Button, Container} from 'reactstrap';

import ButtonViewer from './ButtonViewer';
import ButtonEditor from './ButtonEditor';
import {GET_BUTTONS} from './ButtonViewer';
import gql from 'graphql-tag';
import client from './apollo';


const SUBMIT_BUTTON = gql`
  mutation SubmitButton($input: ButtonInput!) {
    submitButton(input: $input) {
      id
    }
  }
`;

class App extends Component {
  state = {
    editing : null,
  }

  render() {
    const {editing} = this.state;
    async function submitbutton(props) {
      const current_time = new Date;
      const input = {id : 0, time : current_time.toString()}
      await client.mutate({
        variables: {input},
        mutation: SUBMIT_BUTTON,
        refethQueries: () => [{ query: GET_BUTTONS}],
      })
    }
    return (
      <Container fluid>
        <Button
        className="my-2"
        color="primary"
        onClick={()=>this.submitbutton}
        >
        Button
        </Button>
        <ButtonViewer
        canEdit={()=>true}
        onEdit={(button) => this.setState({editing:button})}
        />
        </Container>
    );
  }
}

export default App;
