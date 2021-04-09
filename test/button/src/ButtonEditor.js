import React from 'react';
import gql from 'graphql-tag';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import {Form as FinalForm, Field} from 'react-final-form';

import client from './apollo';
import {GET_BUTTONS} from './ButtonViewer';

const SUBMIT_BUTTON = gql`
  mutation SubmitButton($input: ButtonInput!) {
    submitButton(input: $input) {
      id
    }
  }
`;

const ButtonEditor = ({button, onClose}) => (
  <FinalForm
    onSubmit={async ({id, time}) => {
      const input = {id, time};
      await client.mutate({
        variables: {input},
        mutation: SUBMIT_BUTTON,
        refethQueries: () => [{ query: GET_BUTTONS}],
      });

      onClose();
    }}
    initialValues={button}
    render={({handleSubmit, pristine, invalid}) => (
      <Modal isOpen toggle={onClose}>
        <Form onSubmit={handleSubmit}>
          <ModalHeader toggle={onClose}>
            {button.id ? 'Edit Button' : 'New Button'}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Id</Label>
              <Field
                required
                name="id"
                className="form-control"
                component="input"
              />
            </FormGroup>
            <FormGroup>
              <Label>time</Label>
              <Field
                required
                name="body"
                className="form-control"
                component="input"
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" disabled={pristine} color="primary">Save</Button>
            <Button color="secondary" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </Form>
      </Modal>
    )}
  />
);

export default ButtonEditor;
