import React, {Component, useRef} from 'react';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import {Button, Container} from 'reactstrap';

import ButtonViewer from './ButtonViewer';
import ButtonEditor from './ButtonEditor';
import {GET_BUTTONS} from './ButtonViewer';
import gql from 'graphql-tag';
import client from './apollo';

import {drawHand} from "./utilities";


const SUBMIT_BUTTON = gql`
  mutation SubmitButton($input: ButtonInput!) {
    submitButton(input: $input) {
      id
    }
  }
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.webcamRef = React.createRef();
    this.canvasRef = React.createRef();
    this.state = {
      editing : null,
      handConfidence: null,
      handData: [],
    }
  }

  render() {
    const sleep = (milliseconds) => {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    const runHandpose = async () =>{
      // Loop and detect hands
      const net = await handpose.load();
      console.log("Handpose model loaded.");
      setInterval(()=>{
        detect(net)
      }, 100)
    };
    const detect = async (net) =>{
      if(
        typeof this.webcamRef.current !=="undefined" &&
        this.webcamRef.current !== null &&
        this.webcamRef.current.video.readyState === 4
      ){

        const video = this.webcamRef.current.video;
        const videoWidth = this.webcamRef.current.video.videoWidth;
        const videoHeight = this.webcamRef.current.video.videoHeight;

        this.webcamRef.current.video.width = videoWidth;
        this.webcamRef.current.video.height = videoHeight;

        this.canvasRef.current.width = videoWidth;
        this.canvasRef.current.height = videoHeight;

        // Make Detection
        const hand = await net.estimateHands(video);

        if (typeof hand[0] !== "undefined") {
          console.log(this.state.handData);
          console.log(hand[0])
          this.setState({
            handConfidence: hand[0].handInViewConfidence,
            handData: hand[0]});
          // document.getElementById("current_hand").innerHTML = this.state.handConfidence;

          console.log(this.state.handData);
          // this.setState({hand: hand})
          // console.log(this.state.hand);
          // document.getElementById("current_hand").innerHTML = this.state.hand[0].handInViewConfidence;
        }
        const ctx = this.canvasRef.current.getContext("2d");
        drawHand(hand, ctx);
    }
  };

    const {editing} = this.state;
    async function submitbutton(props) {
      console.log(props)
      const current_time = new Date;
      const gesture = "open_palm";
      console.log(this.hand)
      const current_landmarks = {handInViewConfidence: this.hand.handInViewConfidence}
      const input = {time : current_time.toString(), landmarks: current_landmarks}
      await client.mutate({
        variables: {input},
        mutation: SUBMIT_BUTTON,
        refetchQueries: () => [{ query: GET_BUTTONS}],
      })
    }

    async function test(props) {
      console.log(this.state);
      console.log(this.state.handConfidence);
      document.getElementById("test_id").innerHTML = this.state.handData.handInViewConfidence;
    }

    runHandpose();

    return (
      <div className="App">
        <header className="App-header">
        <Webcam ref={this.webcamRef} audio={false} videoConstraints={{ deviceId: "ed605918acc7be9f3a3e769862a15a4c803f4b39d03a172f78d2dbc549da5172"}}
            style ={{
              position:"absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 9,
              width:320,
              height: 240,
            }}
            />
            <canvas
            ref={this.canvasRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 9,
              width: 320,
              height: 240,
            }}
            />
          <Container fluid>
            <Button
            className="my-2"
            color="primary"
            onClick={submitbutton}
            >
            Button
            </Button>
            <label id="current_hand">{this.state.handData}</label>
            <Button
            onClick={test}
            >
            test
            </Button>
            <label id="test_id"> </label>

            <ButtonViewer
            canEdit={()=>true}
            onEdit={(button) => this.setState({editing:button})}
            />
            </Container>

          </header>
      </div>
    );
  }
}

export default App;
