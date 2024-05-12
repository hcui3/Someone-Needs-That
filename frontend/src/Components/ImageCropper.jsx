/* eslint-disable react/prop-types */
import { useState } from "react";
import Cropper from "react-easy-crop";

const ImageCropper = ({ image, onCropDone, onCropCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  return (
    <div className="relative w-full h-[80vh] flex items-end justify-center rounded overflow-hidden shadow">
      <div>
        <Cropper
          onZoomChange={setZoom}
          onCropChange={setCrop}
          zoom={zoom}
          crop={crop}
          aspect={1426 / 1783}
          image={image}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: {
              width: "100%",
              height: "80%",
              backgroundColor: "#fff",
            },
          }}
        />
      </div>
      <div className="flex justify-center w-full p-4 mb-4">
        <button
          className="text-lg font-medium text-blue-500 bg-white border border-blue-500 rounded px-6 py-2 mx-2 hover:bg-blue-500 hover:text-white focus:outline-none focus:ring"
          onClick={onCropCancel}
        >
          Cancel
        </button>
        <button
          className="text-lg font-medium text-white bg-teal-600 border border-teal-600 rounded px-6 py-2 mx-2 hover:bg-teal-700 focus:outline-none focus:ring"
          onClick={() => {
            onCropDone(croppedArea);
          }}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;
