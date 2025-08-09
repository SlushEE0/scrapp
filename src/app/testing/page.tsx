"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { toast } from "sonner";
import { predict } from "@/lib/backend";
import { BaseStates } from "@/lib/states";

import { Button } from "@/components/ui/button";

export default function Testing() {
  const [imageFormData, setImageFormData] = useState<FormData | undefined>();

  const handlePhotoCapture = function (e: ChangeEvent<HTMLInputElement>) {
    const image = e.target.files?.[0];

    if (!image) return console.warn("No image");

    const formData = new FormData();
    formData.append("file", image);

    setImageFormData(formData);
  };

  useEffect(() => {
    (async () => {
      if (imageFormData) {
        const [state, res] = await predict(imageFormData);

        if (state === BaseStates.ERROR) return toast.error("An Error Occured");

        console.log(JSON.stringify(res));
      }
    })();
  }, [imageFormData]);

  return (
    <div>
      <h1>uplaod</h1>
      <Button className="w-min">
        <input
          type="file"
          accept="image/*"
          capture="environment" // or "user" for front camera
          onChange={handlePhotoCapture}
        />
      </Button>
      <h1>has image: {imageFormData ? "ye" : "na"}</h1>
    </div>
  );
}
