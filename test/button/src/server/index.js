const express = require('express');
const cors = require('cors');
const {graphqlHTTP} = require('express-graphql');
const gql = require('graphql-tag');
const {buildASTSchema} = require('graphql');

const time_sample = new Date;

const BUTTONS = [
  {time: time_sample.toString()}
]

const schema = buildASTSchema(gql`
  type Query {
    buttons: [Button]
    button(id:ID!): Button
  }

  type Button {
    id: ID
    time: String
    gesture: String
    landmarks: [Landmark]
  }

  type Landmark {
    handInViewConfidence: Float
    zero: [String]
    one: [String]
    two: [String]
    three: [String]
    four: [String]
    five: [String]
    six: [String]
    seven: [String]
    eight: [String]
    nine: [String]
    ten: [String]
    eleven: [String]
    twelve: [String]
    thirteen: [String]
    fourteen: [String]
    fifteen: [String]
    sixteen: [String]
    seventeen: [String]
    eighteen: [String]
    nineteen: [String]
    twenty: [String]
  }

  type Mutation {
    submitButton(input: ButtonInput!): Button

  }

  input ButtonInput {
    id: ID
    time: String
  }
`);

const mapButton = (button, id) => button && ({id, ...button});

const root = {
  buttons: () => BUTTONS.map(mapButton),
  button: ({id}) => mapButton(BUTTONS[id], id),
  submitButton: ({input: {id, time}}) => {
    const button = {time};
    let index = BUTTONS.length;

    if (id != null && id >= 0 && id < BUTTONS.length){
      if (BUTTONS[id].authorId !== authorId) return null;

      BUTTONS.splice(id, 1, button);
      index = id;
    } else {
      BUTTONS.push(button);
    }
    return mapButton(button, index);
  },
};

const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

const port = process.env.PORT || 4000
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);
