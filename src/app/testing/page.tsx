"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { Camera, CameraOff, RotateCcw, Download, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavbar } from "@/hooks/useNavbar";

const CameraCapture = () => {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isLoading, setIsLoading] = useState(false);

  const { setDefaultShown } = useNavbar();

  const capture = useCallback(() => {
    if (!webcamRef.current) return;

    setIsLoading(true);
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
      console.log("Captured image:", imageSrc);
    } catch (error) {
      console.error("Error capturing image:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const switchCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }, []);

  const downloadImage = useCallback(() => {
    if (!image) return;

    const link = document.createElement("a");
    link.download = `capture-${new Date().getTime()}.webp`;
    link.href = image;
    link.click();
    link.remove();
  }, [image]);

  const clearImage = useCallback(() => {
    setImage(null);
  }, []);

  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: facingMode
  };

  useEffect(() => {
    setDefaultShown(false);
  }, [setDefaultShown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Camera Capture
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Capture photos with your device camera
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera Card */}
          <Card className="overflow-hidden shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Camera
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={switchCamera}
                    disabled={isDisabled}
                    className="h-9 px-3">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={isDisabled ? "default" : "destructive"}
                    size="sm"
                    onClick={() => setIsDisabled(!isDisabled)}
                    className="h-9 px-3">
                    {isDisabled ? (
                      <Camera className="h-4 w-4" />
                    ) : (
                      <CameraOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden">
                {!isDisabled ? (
                  <Webcam
                    key={facingMode} // Force re-render when switching cameras
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/webp"
                    videoConstraints={videoConstraints}
                    className="w-full h-full object-cover"
                    mirrored={facingMode === "user"}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <CameraOff className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                      <p className="text-slate-500 dark:text-slate-400">
                        Camera is disabled
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={capture}
                disabled={isDisabled || isLoading}
                className="w-full h-12 text-lg font-medium"
                size="lg">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Capturing...
                  </div>
                ) : (
                  <>
                    <Camera className="h-5 w-5 mr-2" />
                    Capture Photo
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card className="overflow-hidden shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Preview</CardTitle>
                {image && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadImage}
                      className="h-9 px-3">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearImage}
                      className="h-9 px-3">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden">
                {image ? (
                  <img
                    src={image}
                    alt="Captured"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
                        <Camera className="h-12 w-12 text-slate-400" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
                        No image captured
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                        Take a photo to see the preview
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
