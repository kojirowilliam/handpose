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
          document.getElementById("pinky0").innerHTML = hand[0].annotations.pinky[0];
          document.getElementById("pinky1").innerHTML = hand[0].annotations.pinky[1];
          document.getElementById("pinky2").innerHTML = hand[0].annotations.pinky[2];
          document.getElementById("pinky3").innerHTML = hand[0].annotations.pinky[3];
          document.getElementById("thumb0").innerHTML = hand[0].annotations.thumb[0];
          document.getElementById("thumb1").innerHTML = hand[0].annotations.thumb[1];
          document.getElementById("thumb2").innerHTML = hand[0].annotations.thumb[2];
          document.getElementById("thumb3").innerHTML = hand[0].annotations.thumb[3];
          document.getElementById("palm_base").innerHTML = hand[0].annotations.palmBase[0];

          const palm_base = document.getElementById("palm_base").innerHTML.split(",");
          const index0 = document.getElementById("index0").innerHTML.split(",");
          const index1 = document.getElementById("index1").innerHTML.split(",");
          const index2 = document.getElementById("index2").innerHTML.split(",");
          const index3 = document.getElementById("index3").innerHTML.split(",");
          const middle0 = document.getElementById("middle0").innerHTML.split(",");
          const middle1 = document.getElementById("middle1").innerHTML.split(",");
          const middle2 = document.getElementById("middle2").innerHTML.split(",");
          const middle3 = document.getElementById("middle3").innerHTML.split(",");
          const ring0 = document.getElementById("ring0").innerHTML.split(",");
          const ring1 = document.getElementById("ring1").innerHTML.split(",");
          const ring2 = document.getElementById("ring2").innerHTML.split(",");
          const ring3 = document.getElementById("ring3").innerHTML.split(",");
          const pinky0 = document.getElementById("pinky0").innerHTML.split(",");
          const pinky1 = document.getElementById("pinky1").innerHTML.split(",");
          const pinky2 = document.getElementById("pinky2").innerHTML.split(",");
          const pinky3 = document.getElementById("pinky3").innerHTML.split(",");
          const thumb0 = document.getElementById("thumb0").innerHTML.split(",");
          const thumb1 = document.getElementById("thumb1").innerHTML.split(",");
          const thumb2 = document.getElementById("thumb2").innerHTML.split(",");
          const thumb3 = document.getElementById("thumb3").innerHTML.split(",");

          // bv stand for base value
          var euclidean_score = 0;

          const index0_bv = [-61.26339126,141.4655587, 5.472402543]
          const index1_bv = [-74.34763685,191.3315684, 8.723541707]
          const index2_bv = [-80.34580778,228.962814,12.22445914]
          const index3_bv = [-84.17808771,261.2174304,15.12117431]
          const middle0_bv = [-23.89210165,148.3105319,5.413627118]
          const middle1_bv = [-26.81526315,206.5770483,8.301603764]
          const middle2_bv = [-28.77805404,250.2371139,12.79834697]
          const middle3_bv = [-29.62159018,284.901491,-16.03917548]
          const ring0_bv = [ 10.45937905, 142.0550588, 7.065842122]
          const ring1_bv = [ 17.29190321, 196.6113173, 10.54424426]
          const ring2_bv = [ 19.59283235, 238.1213407, 14.36407039]
          const ring3_bv = [ 20.24271828, 271.0251258, 16.86407706]
          const pinky0_bv = [ 43.36242166, 123.758792, 10.09051558]
          const pinky1_bv = [ 59.45367901, 166.8725556, 13.95013377]
          const pinky2_bv = [ 66.7828045, 199.4361493, 16.66569373]
          const pinky3_bv = [ 71.03398137, 230.6004986, 18.31777999]
          const thumb0_bv = [-55.72536208, 20.5417742, 10.3399491]
          const thumb1_bv = [ -95.71247384, 59.94203511, 15.13371608]
          const thumb2_bv = [ -116.7848137, 98.30049036, 19.49668548]
          const thumb3_bv = [ -127.1697617, 126.7908667, 23.19322059]

          const index0_value = [palm_base[0] - index0[0], palm_base[1] - index0[1], palm_base[2] - index0[2]]
          const index1_value = [palm_base[0] - index1[0], palm_base[1] - index1[1], palm_base[2] - index1[2]]
          const index2_value = [palm_base[0] - index2[0], palm_base[1] - index2[1], palm_base[2] - index2[2]]
          const index3_value = [palm_base[0] - index3[0], palm_base[1] - index3[1], palm_base[2] - index3[2]]
          const middle0_value = [palm_base[0] - middle0[0], palm_base[1] - middle0[1], palm_base[2] - middle0[2]]
          const middle1_value = [palm_base[0] - middle1[0], palm_base[1] - middle1[1], palm_base[2] - middle1[2]]
          const middle2_value = [palm_base[0] - middle2[0], palm_base[1] - middle2[1], palm_base[2] - middle2[2]]
          const middle3_value = [palm_base[0] - middle3[0], palm_base[1] - middle3[1], palm_base[2] - middle3[2]]
          const ring0_value = [palm_base[0] - ring0[0], palm_base[1] - ring0[1], palm_base[2] - ring0[2]]
          const ring1_value = [palm_base[0] - ring1[0], palm_base[1] - ring1[1], palm_base[2] - ring1[2]]
          const ring2_value = [palm_base[0] - ring2[0], palm_base[1] - ring2[1], palm_base[2] - ring2[2]]
          const ring3_value = [palm_base[0] - ring3[0], palm_base[1] - ring3[1], palm_base[2] - ring3[2]]
          const pinky0_value = [palm_base[0] - pinky0[0], palm_base[1] - pinky0[1], palm_base[2] - pinky0[2]]
          const pinky1_value = [palm_base[0] - pinky1[0], palm_base[1] - pinky1[1], palm_base[2] - pinky1[2]]
          const pinky2_value = [palm_base[0] - pinky2[0], palm_base[1] - pinky2[1], palm_base[2] - pinky2[2]]
          const pinky3_value = [palm_base[0] - pinky3[0], palm_base[1] - pinky3[1], palm_base[2] - pinky3[2]]
          const thumb0_value = [palm_base[0] - thumb0[0], palm_base[1] - thumb0[1], palm_base[2] - thumb0[2]]
          const thumb1_value = [palm_base[0] - thumb1[0], palm_base[1] - thumb1[1], palm_base[2] - thumb1[2]]
          const thumb2_value = [palm_base[0] - thumb2[0], palm_base[1] - thumb2[1], palm_base[2] - thumb2[2]]
          const thumb3_value = [palm_base[0] - thumb3[0], palm_base[1] - thumb3[1], palm_base[2] - thumb3[2]]

          const index0_euclidean = Math.sqrt(Math.pow(index0_value[0], 2) + Math.pow(index0_value[1], 2) + Math.pow(index0_value[2], 2))
          const index1_euclidean = Math.sqrt(Math.pow(index1_value[0], 2) + Math.pow(index1_value[1], 2) + Math.pow(index1_value[2], 2))
          const index2_euclidean = Math.sqrt(Math.pow(index2_value[0], 2) + Math.pow(index2_value[1], 2) + Math.pow(index2_value[2], 2))
          const index3_euclidean = Math.sqrt(Math.pow(index3_value[0], 2) + Math.pow(index3_value[1], 2) + Math.pow(index3_value[2], 2))
          const middle0_euclidean = Math.sqrt(Math.pow(middle0_value[0], 2) + Math.pow(middle0_value[1], 2) + Math.pow(middle0_value[2], 2))
          const middle1_euclidean = Math.sqrt(Math.pow(middle1_value[0], 2) + Math.pow(middle1_value[1], 2) + Math.pow(middle1_value[2], 2))
          const middle2_euclidean = Math.sqrt(Math.pow(middle2_value[0], 2) + Math.pow(middle2_value[1], 2) + Math.pow(middle2_value[2], 2))
          const middle3_euclidean = Math.sqrt(Math.pow(middle3_value[0], 2) + Math.pow(middle3_value[1], 2) + Math.pow(middle3_value[2], 2))
          const ring0_euclidean = Math.sqrt(Math.pow(ring0_value[0], 2) + Math.pow(ring0_value[1], 2) + Math.pow(ring0_value[2], 2))
          const ring1_euclidean = Math.sqrt(Math.pow(ring1_value[0], 2) + Math.pow(ring1_value[1], 2) + Math.pow(ring1_value[2], 2))
          const ring2_euclidean = Math.sqrt(Math.pow(ring2_value[0], 2) + Math.pow(ring2_value[1], 2) + Math.pow(ring2_value[2], 2))
          const ring3_euclidean = Math.sqrt(Math.pow(ring3_value[0], 2) + Math.pow(ring3_value[1], 2) + Math.pow(ring3_value[2], 2))
          const pinky0_euclidean = Math.sqrt(Math.pow(pinky0_value[0], 2) + Math.pow(pinky0_value[1], 2) + Math.pow(pinky0_value[2], 2))
          const pinky1_euclidean = Math.sqrt(Math.pow(pinky1_value[0], 2) + Math.pow(pinky1_value[1], 2) + Math.pow(pinky1_value[2], 2))
          const pinky2_euclidean = Math.sqrt(Math.pow(pinky2_value[0], 2) + Math.pow(pinky2_value[1], 2) + Math.pow(pinky2_value[2], 2))
          const pinky3_euclidean = Math.sqrt(Math.pow(pinky3_value[0], 2) + Math.pow(pinky3_value[1], 2) + Math.pow(pinky3_value[2], 2))
          const thumb0_euclidean = Math.sqrt(Math.pow(thumb0_value[0], 2) + Math.pow(thumb0_value[1], 2) + Math.pow(thumb0_value[2], 2))
          const thumb1_euclidean = Math.sqrt(Math.pow(thumb1_value[0], 2) + Math.pow(thumb1_value[1], 2) + Math.pow(thumb1_value[2], 2))
          const thumb2_euclidean = Math.sqrt(Math.pow(thumb2_value[0], 2) + Math.pow(thumb2_value[1], 2) + Math.pow(thumb2_value[2], 2))
          const thumb3_euclidean = Math.sqrt(Math.pow(thumb3_value[0], 2) + Math.pow(thumb3_value[1], 2) + Math.pow(thumb3_value[2], 2))

          euclidean_score += index0_euclidean + index1_euclidean + index2_euclidean + index3_euclidean + middle0_euclidean + middle1_euclidean + middle2_euclidean +middle3_euclidean + ring0_euclidean
          euclidean_score += ring1_euclidean + ring2_euclidean + ring3_euclidean + pinky0_euclidean + pinky1_euclidean + pinky2_euclidean + pinky3_euclidean + thumb0_euclidean + thumb1_euclidean
          euclidean_score += thumb2_euclidean + thumb3_euclidean

          euclidean_score /= 20

          const euclidean_sim_score = 1/(1+euclidean_score)

          console.log(euclidean_sim_score);
          document.getElementById("euclidean_sim").innerHTML = euclidean_sim_score;
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
      const zero = document.getElementById("palm_base").innerHTML.split(",");
      const one = document.getElementById("index0").innerHTML.split(",");
      const two = document.getElementById("index1").innerHTML.split(",");
      const three = document.getElementById("index2").innerHTML.split(",");
      const four = document.getElementById("index3").innerHTML.split(",");
      const five = document.getElementById("middle0").innerHTML.split(",");
      const six = document.getElementById("middle1").innerHTML.split(",");
      const seven = document.getElementById("middle2").innerHTML.split(",");
      const eight = document.getElementById("middle3").innerHTML.split(",");
      const nine = document.getElementById("ring0").innerHTML.split(",");
      const ten = document.getElementById("ring1").innerHTML.split(",");
      const eleven = document.getElementById("ring2").innerHTML.split(",");
      const twelve = document.getElementById("ring3").innerHTML.split(",");
      const thirteen = document.getElementById("pinky0").innerHTML.split(",");
      const fourteen = document.getElementById("pinky1").innerHTML.split(",");
      const fifteen = document.getElementById("pinky2").innerHTML.split(",");
      const sixteen = document.getElementById("pinky3").innerHTML.split(",");
      const seventeen = document.getElementById("thumb0").innerHTML.split(",");
      const eighteen = document.getElementById("thumb1").innerHTML.split(",");
      const nineteen = document.getElementById("thumb2").innerHTML.split(",");
      const twenty = document.getElementById("thumb3").innerHTML.split(",");

      const current_landmarks = {handInViewConfidence: confidence, zero: zero, one: one, two: two, three: three, four: four, five: five, six: six, seven: seven, eight: eight, nine: nine, ten: ten, eleven: eleven, twelve: twelve, thirteen: thirteen, fourteen: fourteen, fifteen: fifteen, sixteen: sixteen, seventeen: seventeen, eighteen: eighteen, nineteen: nineteen, twenty: twenty};
      const input = {time : current_time.toString(), landmarks: current_landmarks};
      await client.mutate({
        variables: {input},
        mutation: SUBMIT_BUTTON,
        refetchQueries: () => [{ query: GET_BUTTONS}],
      })
    }

    async function test(props) {
      const current_time = new Date;
      // const confidence = document.getElementById("hand_confidence_title").innerHTML;
      // const current_landmarks = {handInViewConfidence: confidence};
      const input = {time : current_time.toString()};
      await client.mutate({
        variables: {input},
        mutation: SUBMIT_BUTTON,
        refetchQueries: () => [{ query: GET_BUTTONS}],
      })
      // console.log([document.getElementById("ring0").innerHTML][0]);
      // const lis = document.getElementById("ring0").innerHTML.split(",");
      // document.getElementById("test_id").innerHTML = lis[2];
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
            <label>Euclidean Similarity Score: </label>
            <label id="euclidean_sim"></label>
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
