'use client'

import useCamera from "@/hooks/useCamera";
import { useState } from "react";

export default function Testing() {
  const { Component: Camera, getCaptureImage, switchDirection } = useCamera();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = () => {
    const imageData = getCaptureImage();
    if (imageData) {
      setCapturedImage(imageData);
    }
  };

  const handleSwitchCamera = () => {
    switchDirection();
  };

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center gap-6 p-4">
      <h1 className="text-2xl font-bold">Camera Testing</h1>
      
      <div className="flex flex-col gap-4 items-center">
        <div className="w-96 h-72 border-2 border-gray-300 rounded-lg overflow-hidden">
          <Camera />
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={handleCapture}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Capture Photo
          </button>
          <button 
            onClick={handleSwitchCamera}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Switch Camera
          </button>
        </div>
      </div>

      {capturedImage && (
        <div className="flex flex-col gap-2 items-center">
          <h2 className="text-lg font-semibold">Captured Image:</h2>
          <div className="w-96 h-72 border-2 border-gray-300 rounded-lg overflow-hidden">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-full object-cover"
            />
          </div>
          <button 
            onClick={() => setCapturedImage(null)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Clear Image
          </button>
        </div>
      )}
    </div>
  );
}
