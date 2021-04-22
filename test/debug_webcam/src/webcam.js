import React from "react";
import Webcam from "react-webcam";

const WebcamCapture = () => {
  return (
    <>
      <div>
        <Webcam audio={false} videoConstraints={{ deviceId: "ed605918acc7be9f3a3e769862a15a4c803f4b39d03a172f78d2dbc549da5172"}}/>
      </div>
    </>
  );
};

// const WebcamCapture = () => {
//   const [deviceId, setDeviceId] = React.useState({});
//   const [devices, setDevices] = React.useState([]);
//
//   const handleDevices = React.useCallback(
//     mediaDevices =>
//       setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
//     [setDevices]
//   );
//
//   React.useEffect(
//     () => {
//       navigator.mediaDevices.enumerateDevices().then(handleDevices);
//     },
//     [handleDevices]
//   );
//
//   return (
//     <>
//       {devices.map((device, key) => (
//           <div>
//             <Webcam audio={false} videoConstraints={{ deviceId: device.deviceId }} />
//             {console.log(device.deviceId)}
//             {device.label || `Device ${key + 1}`}
//           </div>
//
//         ))}
//     </>
//   );
// };

export default WebcamCapture;
