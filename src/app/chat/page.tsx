"use client";

import { useEffect, useState } from "react";
import { useNavbar } from "@/hooks/useNavbar";
import { useIsMobile } from "@/hooks/use-mobile";

import { Camera as CameraIcon, Send, Trash } from "lucide-react";
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

interface Message {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraSheetOpen, setIsCameraSheetOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
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
  ]);

  const { setDefaultShown } = useNavbar();
  const isMobile = useIsMobile();

  const Camera = useCamera({});

  useEffect(() => {
    setDefaultShown(false);
  }, [setDefaultShown]);

  const onImageCapture = function () {
    const imageData = Camera.getCaptureImage();
    setCapturedImage(imageData || null);
    if (isMobile) {
      setIsCameraSheetOpen(false);
    }
  };

  const onCameraClose = function () {
    if (isMobile) {
      setIsCameraSheetOpen(false);
    }
  };

  return (
    <div className="h-screen flex p-6 gap-6">
      <Card className="flex-2 max-w-[800px]">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent className="overflow-scroll">{lorem}</CardContent>
        <CardFooter className="flex gap-2">
          <Textarea
            placeholder="Let's chat!"
            className="size-full border outline-none resize-none"
          />
          <div className="h-full flex flex-col gap-2">
            <Button variant="outline" className="self-end size-10">
              <Trash className="size-5" />
            </Button>
            <Button variant="outline" className="self-end size-10">
              <Send className="size-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent>hhehhehe</CardContent>
      </Card>
    </div>
  );
}

var lorem = `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro
          dolores, suscipit, expedita similique esse vitae culpa animi debitis
          omnis at minima, sit placeat veritatis. Dolorem natus iusto
          consequatur ea recusandae? Minima neque facere laborum fugit placeat
          sed! Illum eveniet dolores dolorum a. Enim repellendus soluta quasi
          ad, id hic similique aliquam nostrum facere vitae labore eum velit
          ipsam provident ut! Nisi, eligendi tempora adipisci ipsa ipsum dolor,
          error autem, natus at praesentium earum ullam. Autem inventore
          voluptatem nulla, rerum similique, labore laboriosam, non perspiciatis
          fuga ipsa voluptate! Exercitationem, nemo itaque. Molestias rem error
          quasi rerum dolores eum suscipit debitis beatae vero reprehenderit
          alias at id assumenda magnam animi soluta, deleniti quisquam maiores
          accusantium, quo exercitationem! Error at ipsum odit! Suscipit?
          Maiores, cupiditate mollitia! Ullam vel facilis aut quia, ea quis
          modi? Illo earum, nesciunt libero debitis dicta dolor sapiente itaque
          modi odio temporibus in aliquam aut error ab, rerum officia? Aliquid
          recusandae corrupti est autem, iure totam molestias illum laudantium?
          Est, nesciunt molestias? Magnam accusamus veritatis officiis,
          distinctio vero, esse rem ullam autem accusantium nisi qui
          necessitatibus. Doloremque, voluptatibus suscipit. Eveniet a inventore
          ullam dolor iusto tenetur accusamus nulla ut tempora recusandae
          aliquid neque, mollitia modi omnis, dignissimos magnam voluptatem.
          Temporibus doloribus asperiores vero aut porro harum, numquam voluptas
          quam. Distinctio consectetur, accusamus saepe exercitationem explicabo
          pariatur mollitia omnis fugiat ab nihil nam perferendis ex dolores
          labore eos, quas, assumenda in temporibus? Eum rem, delectus
          laboriosam doloremque officiis voluptatum esse? Voluptatum eos saepe,
          inventore quae consectetur cupiditate id ad est quos. Tenetur
          doloremque inventore obcaecati tempore, iure, laboriosam cum, ratione
          odit libero perspiciatis doloribus excepturi possimus hic? Quaerat,
          nam nobis. Quisquam placeat provident beatae totam deserunt quibusdam
          omnis earum incidunt nisi, veniam sint suscipit neque eveniet corporis
          itaque maxime ullam facere dolor accusantium. Perferendis distinctio,
          repudiandae ut hic autem praesentium. Vel, quia commodi reiciendis
          libero similique at iusto, ipsa eveniet et cupiditate rem sint!
          Dolorum exercitationem, ab est enim delectus molestias odio quae
          facilis? Minima, maiores accusantium. Soluta, cumque vel. Similique
          facilis odio deleniti ipsa velit enim quaerat dicta cumque est beatae
          at nobis natus necessitatibus voluptatibus quidem magni, fugit
          molestiae id ab repudiandae saepe sequi? Placeat esse corporis in?
          Perspiciatis corporis ad quas eius quisquam quaerat, aspernatur
          dolorem et similique laudantium quia dolorum esse. Perferendis
          doloremque earum tempora magni, laboriosam dolores reprehenderit,
          corporis magnam accusantium, debitis modi pariatur vitae. Iste ipsa
          aut odit explicabo vitae sequi commodi eius voluptatum facere dolores
          voluptatem nostrum doloribus sint suscipit eaque quae totam assumenda
          possimus, sunt iure fugit ad placeat? Eligendi, eaque ullam! Sequi
          eaque natus rerum earum nemo molestias, aperiam odit pariatur
          distinctio obcaecati omnis quidem ducimus consequatur quod, laudantium
          impedit quisquam incidunt error sed qui expedita neque. Officiis
          voluptate modi suscipit. Accusamus perspiciatis praesentium ratione
          placeat quasi nesciunt alias adipisci pariatur laboriosam, assumenda
          veritatis ipsa recusandae dolorem numquam eaque minima! Repellendus
          recusandae modi ex odio adipisci, nisi soluta animi ab harum. Ducimus
          neque dolorem quo aliquid aspernatur, doloribus voluptatem, sequi
          quidem, dolorum nam repudiandae? Expedita, est praesentium deserunt
          distinctio repudiandae, itaque nostrum nihil culpa aliquid veniam
          laboriosam? Incidunt quidem est cupiditate. Officia explicabo eos ex
          earum similique minima magnam necessitatibus quasi labore quis tempora
          tenetur magni aut ipsam expedita dolor reprehenderit quam voluptas
          quo, animi nam tempore consectetur? Dolorem, nam earum! Quam doloribus
          laboriosam officiis possimus at architecto inventore autem voluptate
          iusto natus est ipsa corrupti doloremque, deleniti mollitia aperiam
          quia incidunt saepe tenetur, officia in explicabo! Doloribus sequi at
          officia? Accusantium, inventore esse ipsa aut ipsam excepturi amet
          ratione similique earum nobis exercitationem quasi possimus quia qui
          aperiam reprehenderit repellat maxime sit saepe! Nihil ratione magnam
          iusto sequi at? Quam.`;
