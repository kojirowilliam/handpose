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
    this.handData = null;
    this.state = {
      editing : null,
      confidence: null,
      indexFinger: null,
      middleFinger: null,
      palmBase: null,
      pinky: null,
      ringFinger: null,
      thumb: null,
      test: 0,
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
          // this.setState({
          //   confidence: hand[0].handInViewConfidence,
          //   indexFinger: hand[0].annotations.indexFinger,
          //   middleFinger: hand[0].annotations.middleFinger,
          //   palmBase: hand[0].annotations.palmBase,
          //   pinky: hand[0].annotations.pinky,
          //   ringFinger: hand[0].annotations.ringFinger,
          //   thumb: hand[0].annotations.thumb});
          document.getElementById("hand_confidence_title").innerHTML = hand[0].handInViewConfidence;
          document.getElementById("index0").innerHTML = hand[0].annotations.indexFinger[0];
          document.getElementById("index1").innerHTML = hand[0].annotations.indexFinger[1];
          document.getElementById("index2").innerHTML = hand[0].annotations.indexFinger[2];
          document.getElementById("index3").innerHTML = hand[0].annotations.indexFinger[3];
          document.getElementById("middle0").innerHTML = hand[0].annotations.middleFinger[0];
          document.getElementById("middle1").innerHTML = hand[0].annotations.middleFinger[1];
          document.getElementById("middle2").innerHTML = hand[0].annotations.middleFinger[2];
          document.getElementById("middle3").innerHTML = hand[0].annotations.middleFinger[3];
          document.getElementById("ring0").innerHTML = hand[0].annotations.ringFinger[0];
          document.getElementById("ring1").innerHTML = hand[0].annotations.ringFinger[1];
          document.getElementById("ring2").innerHTML = hand[0].annotations.ringFinger[2];
          document.getElementById("ring3").innerHTML = hand[0].annotations.ringFinger[3];
          console.log(hand[0].annotations.pinky[0]);
          document.getElementById("pinky0").innerHTML = hand[0].annotations.pinky[0];
          document.getElementById("pinky1").innerHTML = hand[0].annotations.pinky[1];
          document.getElementById("pinky2").innerHTML = hand[0].annotations.pinky[2];
          document.getElementById("pinky3").innerHTML = hand[0].annotations.pinky[3];
          document.getElementById("thumb0").innerHTML = hand[0].annotations.thumb[0];
          document.getElementById("thumb1").innerHTML = hand[0].annotations.thumb[1];
          document.getElementById("thumb2").innerHTML = hand[0].annotations.thumb[2];
          document.getElementById("thumb3").innerHTML = hand[0].annotations.thumb[3];
          document.getElementById("palm_base").innerHTML = hand[0].annotations.palmBase[0];
          console.log(document.getElementById("thumb3").innerHTML);
        }
        const ctx = this.canvasRef.current.getContext("2d");
        drawHand(hand, ctx);
    }
  };

    const {editing} = this.state;
    async function submitbutton(props) {
      const current_time = new Date;
      const gesture = document.getElementById("gesture_type").innerHTML;
      const confidence = document.getElementById("hand_confidence_title").innerHTML;
      // const index_finger = [document.getElementById("index0").innerHTML, document.getElementById("index1").innerHTML, document.getElementById("index2").innerHTML, document.getElementById("index3").innerHTML];
      // const middle_finger = [document.getElementById("middle0").innerHTML, document.getElementById("middle1").innerHTML, document.getElementById("middle2").innerHTML, document.getElementById("middle3").innerHTML];
      // const ring_finger = [document.getElementById("ring0").innerHTML, document.getElementById("ring1").innerHTML, document.getElementById("ring2").innerHTML, document.getElementById("ring3").innerHTML];
      // const pinky = [document.getElementById("pinky0").innerHTML, document.getElementById("pinky1").innerHTML, document.getElementById("pinky2").innerHTML, document.getElementById("pinky3").innerHTML];
      // const thumb = [document.getElementById("thumb0").innerHTML, document.getElementById("thumb1").innerHTML, document.getElementById("thumb2").innerHTML, document.getElementById("thumb3").innerHTML];
      // const palm_base = document.getElementById("palm_base").innerHTML;
      const zero = document.getElementById("palm_base").innerHTML;
      const one = document.getElementById("index0").innerHTML;
      const two = document.getElementById("index1").innerHTML;
      const three = document.getElementById("index2").innerHTML;
      const four = document.getElementById("index3").innerHTML;
      const five = document.getElementById("middle0").innerHTML;
      const six = document.getElementById("middle1").innerHTML;
      const seven = document.getElementById("middle2").innerHTML;
      const eight = document.getElementById("middle3").innerHTML;
      const nine = document.getElementById("ring0").innerHTML;
      const ten = document.getElementById("ring1").innerHTML;
      const eleven = document.getElementById("ring2").innerHTML;
      const twelve = document.getElementById("ring3").innerHTML;
      const thirteen = document.getElementById("pinky0").innerHTML;
      const fourteen = document.getElementById("pinky1").innerHTML;
      const fifteen = document.getElementById("pinky2").innerHTML;
      const sixteen = document.getElementById("pinky3").innerHTML;
      const seventeen = document.getElementById("thumb0").innerHTML;
      const eighteen = document.getElementById("thumb1").innerHTML;
      const nineteen = document.getElementById("thumb2").innerHTML;
      const twenty = document.getElementById("thumb3").innerHTML;

      const current_landmarks = {handInViewConfidence: confidence, zero: zero, one: one, two: two, three: three, four: four, five: five, six: six, seven: seven, eight: eight, nine: nine, ten: ten, eleven: eleven, twelve: twelve, thirteen: thirteen, fourteen: fourteen, fifteen: fifteen, sixteen: sixteen, seventeen: seventeen, eighteen: eighteen, nineteen: nineteen, twenty: twenty};
      const input = {time : current_time.toString(), landmarks: current_landmarks};
      await client.mutate({
        variables: {input},
        mutation: SUBMIT_BUTTON,
        refetchQueries: () => [{ query: GET_BUTTONS}],
      })
    }

    async function test(props) {
      document.getElementById("test_id").innerHTML = document.getElementById("hand_confidence_title").innerHTML;
    }

    runHandpose();

    return (
      <div className="App">
        <header className="App-header">
          <div id="hand_viewer" style={{position:"absolute",right:670, top:20}}>
            <div id="webcams" style={{position:"relative"}}>
              <Webcam ref={this.webcamRef}
                style ={{
                  position:"absolute",
                  marginLeft: "auto",
                  marginRight: "auto",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  zindex: 9,
                  width:640,
                  height: 480,
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
                  width: 640,
                  height: 480,
                }}
                />
              </div>
              <div id="hand_details" style={{position:"absolute", top:480}}>
              <label for="gesture_type">Gesture Type: </label>
              <input type="text" id="gesture_type" name="gesture_type"/>
              <p></p>
              <label>Hand In View Confidence:   </label>
              <label id="hand_confidence_title"></label>
              <h3>Finger Positions:</h3>
              <label>Index Finger: </label>
              <label id="index_finger"></label>
              <ul>
                <li id="index0"></li>
                <li id="index1"></li>
                <li id="index2"></li>
                <li id="index3"></li>
              </ul>
              <label>Middle Finger: </label>
              <label id="middle_finger"></label>
              <ul>
                <li id="middle0"></li>
                <li id="middle1"></li>
                <li id="middle2"></li>
                <li id="middle3"></li>
              </ul>
              <label>Palm Base: </label>
              <ul>
                <li id="palm_base"></li>
              </ul>
              <label>Pinky: </label>
              <label id="pinky"></label>
              <ul>
                <li id="pinky0"></li>
                <li id="pinky1"></li>
                <li id="pinky2"></li>
                <li id="pinky3"></li>
              </ul>
              <label>Ring Finger: </label>
              <label id="ring_finger"></label>
              <ul>
                <li id="ring0"></li>
                <li id="ring1"></li>
                <li id="ring2"></li>
                <li id="ring3"></li>
              </ul>
              <label>Thumb: </label>
              <label id="thumb"></label>
              <ul>
                <li id="thumb0"></li>
                <li id="thumb1"></li>
                <li id="thumb2"></li>
                <li id="thumb3"></li>
              </ul>
              </div>
            </div>
          <Container fluid>
            <Button
            className="my-2"
            color="primary"
            onClick={submitbutton}
            >
            Button
            </Button>
            <label id="current_hand"> </label>
            <Button
            onClick={test}
            >
            test
            </Button>
            <label id="test_id"> </label>
            <p>{this.state.test}</p>
            <Button
            onClick={()=> this.setState({test:this.state.test + 1})}> Click </Button>
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
