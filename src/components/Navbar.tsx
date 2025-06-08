"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  User,
  FileSpreadsheet,
  Clock,
  Settings,
  LucideFingerprint
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useUser } from "@/hooks/useUser";
import { useIsMobile } from "@/hooks/use-mobile";
import type { User_t } from "../lib/types";

export default function Navbar({}) {
  const isMobile = useIsMobile();
  const [user, setUser] = useUser();

  return isMobile ? <Mobile /> : <Desktop {...{ user }} />;
}

function Mobile() {
  return (
    <div className="sticky top-0 left-0 m-0 p-5 w-full h-20 bg-red-600">
      I am a navbar
    </div>
  );
}

function Desktop({ user }: { user: User_t }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 100) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [lastScrollY]);

  const onNavigate = function (url: string) {
    toast(`Navigating to ${url}`);
  };

  const generateNavButton = function (
    icon: React.ReactNode,
    label: string,
    url: string,
    key: any
  ) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
        key={key}
        onClick={onNavigate.bind(null, url)}>
        <div className="size-4">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </Button>
    );
  };

  const navButtons = [
    {
      icon: <User className="h-4 w-4" />,
      label: "Profile",
      url: "/profile"
    },
    {
      icon: <FileSpreadsheet className="h-4 w-4" />,
      label: "Budget",
      url: "/budget"
    },
    {
      icon: <Clock className="h-4 w-4" />,
      label: "Outreach",
      url: "/outreach"
    },
    {
      icon: <Settings className="h-4 w-4" />,
      label: "Admin",
      url: "/admin"
    }
  ];

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}>
      <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl px-6 py-3">
        <div className="flex items-center justify-between space-x-8">
          <nav className="flex items-center space-x-2">
            {navButtons.map((button, index) =>
              generateNavButton(button.icon, button.label, button.url, index)
            )}
          </nav>

          <div className="flex items-center space-x-3 pl-6 border-l border-border">
            <span className="text-sm font-medium text-foreground">
              {user?.username || "Guest"}
            </span>
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.avatarUrl}
                alt={user?.username}
                className="rounded-full"
              />
              <AvatarFallback className="bg-muted text-muted-foreground text-xs rounded-full flex items-center justify-center h-full w-full">
                {user?.username?.charAt(0) || "G"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
}
