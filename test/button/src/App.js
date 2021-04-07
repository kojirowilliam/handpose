import React, {Component} from 'react';
import {Button, Container} from 'reactstrap';

import ButtonViewer from './ButtonViewer';
import ButtonEditor from './ButtonEditor';

class App extends Components {
  state = {
    editing : null,
  }

  render() {
    const {editing} = this.state;

    return (
      <Container fluid>
        <Button

    )
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
