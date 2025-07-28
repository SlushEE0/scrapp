"use client";

import { useState, useRef, ComponentProps } from "react";
import Webcam, { WebcamProps } from "react-webcam";

export default function useCamera() {
  const webcamRef = useRef<Webcam>(null);

  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment"
  );

  const getCaptureImage = function () {
    if (webcamRef.current) {
      const imageData = webcamRef.current.getScreenshot();
      return imageData;
    }
  };

  const switchDirection = function (facingMode?: "environment" | "user") {
    if (facingMode) return setFacingMode(facingMode);

    if (webcamRef.current) {
      const newFacingMode = facingMode === "user" ? "environment" : "user";
      setFacingMode(newFacingMode);
    }
  };

  const Component = ({ ...props }: Partial<WebcamProps>) => {
    let propsToAssign = {
      ref: webcamRef,
      screenshotFormat: "image/png" as const,
      videoConstraints: { facingMode },

      ...props
    };

    return <Webcam {...propsToAssign} />;
  };

  return {
    getCaptureImage,
    switchDirection,
    Component
  };
}
