import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Table } from 'reactstrap';

export const GET_BUTTONS = gql`
  query GetButtons {
    buttons {
      id
      time
    }
  }
`;

const rowStyles = (button, canEdit) => canEdit(button)
? {cursor: 'pointer', fontWeight:'bold'}
: {};

const ButtonViewer = ({canEdit, onEdit}) => (
  <Query query = {GET_BUTTONS}>
    {({loading, data}) => !loading && (
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.buttons.map(button => (
            <tr
            key={button.id}
            style={rowStyles(button, canEdit)}
            onClick={()=>canEdit(button) && onEdit(button)}
            >
              <td>{button.id}</td>
              <td>{button.time}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}
  </Query>
);

ButtonViewer.defaultProps = {
  canEdit: () => false,
  onEdit: () => null,
};

export default ButtonViewer;
