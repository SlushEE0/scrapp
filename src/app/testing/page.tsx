"use client";

import useCamera from "@/hooks/useCamera";
import { useState, ChangeEvent } from "react";

export default function Testing() {
  const handlePhotoCapture = function (e: ChangeEvent<HTMLInputElement>) {
    console.log(e);
  };

  return (
    <div>
      <h1>Hello</h1>
      <input
        type="file"
        accept="image/*"
        capture="environment" // or "user" for front camera
        onChange={handlePhotoCapture}/>
    </div>
  );
}
