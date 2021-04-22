import React, {useRef} from 'react';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
// import logo from './logo.svg';
import './App.css';
import {drawHand} from "./utilities";

function App() {
  const webcamRef = useRef(null); // Allows us to references to this function and pass it to other functions
  const canvasRef = useRef(null);

  const runHandpose = async () =>{
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    // Loop and detect hands
    setInterval(()=>{
      detect(net)
    }, 100)
  };

  const detect = async (net) =>{
    if(
      typeof webcamRef.current !=="undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ){

  const video = webcamRef.current.video;
  const videoWidth = webcamRef.current.video.videoWidth;
  const videoHeight = webcamRef.current.video.videoHeight;

  webcamRef.current.video.width = videoWidth;
  webcamRef.current.video.height = videoHeight;

  canvasRef.current.width = videoWidth;
  canvasRef.current.height = videoHeight;

  // Make Detection
  const hand = await net.estimateHands(video);
  if (typeof hand[0] !== "undefined") {
  console.log(hand[0]);
}
  const ctx = canvasRef.current.getContext("2d");
  drawHand(hand, ctx);
  }
};

  runHandpose();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam ref={webcamRef} videoConstraints = {{deviceId: "ed605918acc7be9f3a3e769862a15a4c803f4b39d03a172f78d2dbc549da5172"}}
        style ={{
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
        <canvas
        ref={canvasRef}
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
      </header>
    </div>
  );
}

export default App;
