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
      const input = {time : current_time.toString()}
      console.log("Inside of Function BEFORE client.mutate")
      await client.mutate({
        variables: {input},
        mutation: SUBMIT_BUTTON,
        refetchQueries: () => [{ query: GET_BUTTONS}],
      })
      console.log("Inside of Function AFTER client.mutate")
    }
    return (
      <Container fluid>
        <Button
        className="my-2"
        color="primary"
        onClick={submitbutton}
        >
        Button
        </Button>
        
        // <Button
        // className="my-3"
        // color="primary"
        // onClick={clearsubmitions}
        // >
        // Clear
        // </Button>

        <ButtonViewer
        canEdit={()=>true}
        onEdit={(button) => this.setState({editing:button})}
        />
        </Container>
    );
  }
}

export default App;
