"use client";

import { ChangeEvent, Suspense, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useNavbar } from "@/hooks/useNavbar";
import { useIsMobile } from "@/hooks/use-mobile";

import { Camera as CameraIcon, Send, Trash, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useCamera from "@/hooks/useCamera";
import { MessageBubble } from "@/components/MessageBubble";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Loader from "@/components/Loader";

interface Message {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(ALL_MESSAGES);
  const [chatPrompt, setChatPrompt] = useState("");

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<Webcam>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<
    "user" | "environment"
  >("environment");

  const { setDefaultShown } = useNavbar();
  const isMobile = useIsMobile();

  useEffect(() => {
    setDefaultShown(false);
  }, [setDefaultShown]);

  const handleCaptureImage = function () {
    if (cameraRef.current) {
      const image = cameraRef.current.getScreenshot();
      setCapturedImage(image);

      console.log("captured");
    }
  };

  const handleModifyChatPrompt = function (
    e: ChangeEvent<HTMLTextAreaElement>
  ) {
    setChatPrompt(e.target.value);
  };

  const handleFormSubmit = function (formData: FormData) {
    const prompt = formData.get("prompt")?.toString() || "";
    setChatPrompt("");

    setMessages((messages) => [
      ...messages,
      {
        id: "4",
        isUser: true,
        message: prompt,
        timestamp: new Date()
      }
    ]);
  };

  const handleClearImage = function () {
    setCapturedImage(null);
  };

  const handleClearText = function () {
    setChatPrompt("");
  };

  return (
    <div className="h-screen flex p-6 gap-6">
      <Card className="flex-2 max-w-[800px]">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent className="overflow-scroll h-full">
          {messages.map((message) => (
            <MessageBubble {...message} key={message.id} />
          ))}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div className="flex gap-2 justify-baseline items-baseline w-full">
            <div className="relative group">
              <img
                src={capturedImage || undefined}
                className="h-30 rounded-md"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-100 rounded-md flex items-center justify-center">
                <X
                  className="size-6 text-white cursor-pointer"
                  onClick={handleClearImage}
                />
              </div>
            </div>
          </div>
          <form
            className="w-full flex items-center gap-2 p-0"
            action={handleFormSubmit}>
            <Textarea
              enterKeyHint="send"
              name="prompt"
              value={chatPrompt}
              onChange={handleModifyChatPrompt}
              placeholder="Let's chat!"
              className="size-full border outline-none resize-none h-22"
            />
            <div className="h-full flex flex-col gap-2">
              <Button
                onClick={handleClearText}
                type="button"
                variant="outline"
                className="self-end size-10">
                <Trash className="size-5" />
              </Button>
              <Button
                type="submit"
                variant="outline"
                className="self-end size-10">
                <Send className="size-5" />
              </Button>
            </div>
          </form>
        </CardFooter>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Camera</CardTitle>
        </CardHeader>
        <CardContent>
          {cameraRef ? (
            <Webcam
              className="rounded-md border"
              ref={cameraRef}
              mirrored={true}></Webcam>
          ) : (
            <Loader />
          )}

          <button
            onClick={handleCaptureImage}
            className="relative -top-5 -translate-y-full left-1/2 -translate-x-1/2 m-0 p-0 rounded-full size-20 bg-white/50 hover:bg-white/70 transition-all duration-200 flex items-center justify-center">
            <CameraIcon className="size-full m-4 opacity-55" stroke="black" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

var ALL_MESSAGES = [
  {
    id: "1",
    message: "Hello! How can I help you today?",
    isUser: false,
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: "2",
    message: "I'd like to know more about this app's features.",
    isUser: true,
    timestamp: new Date(Date.now() - 3 * 60 * 1000)
  },
  {
    id: "3",
    message:
      "This is a modern chat application with camera integration. You can capture images and send messages in real-time. The interface is responsive and works great on both desktop and mobile devices.",
    isUser: false,
    timestamp: new Date(Date.now() - 1 * 60 * 1000)
  }
];
