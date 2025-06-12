"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { User, FileSpreadsheet, Clock, Signature } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useUser } from "@/hooks/useUser";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavbar } from "@/hooks/useNavbar";
import type { PBUser_t } from "../lib/types";
import { logout } from "@/lib/auth";
import { recordToImageUrl } from "@/lib/pbaseClient";

let navItems = [
  {
    onlyHomePersist: true,
    icon: <User className="h-5 w-5" />,
    label: "Home",
    url: "/home",
    msg: "Going to Home"
  },
  {
    icon: <FileSpreadsheet className="h-5 w-5" />,
    label: "Budget",
    url: "/budget",
    msg: "Going to Budget"
  },
  {
    icon: <Clock className="h-5 w-5" />,
    label: "Outreach",
    url: "/outreach",
    msg: "Going to Outreach"
  },
  {
    onlyHomePersist: true,
    icon: <Signature className="h-5 w-5" />,
    label: "Sign Out",
    url: "/",
    msg: "Signing Out",
    func: () => {
      logout();
      return false;
    }
  }
  // {
  //   icon: <Settings className="h-5 w-5" />,
  //   label: "Admin",
  //   url: "/admin",
  //   msg: "Going to Admin"
  // }
];

export default function Navbar({}) {
  const isMobile = useIsMobile();
  const { user, setUser } = useUser();

  const { forcedDisable, setForcedDisable, renderOnlyHome } = useNavbar();

  const router = useRouter();

  type NavigateParams = { url: string; msg?: string; func?: () => boolean };

  if (renderOnlyHome) {
    navItems = navItems.filter((item) => item.onlyHomePersist);
  }

  const onNavigate = function ({
    url,
    msg,
    func = () => true
  }: NavigateParams) {
    toast(`Navigating to ${url}`);

    if (func()) router.push(url);
  };

  // Forced disable is disabled by default
  useEffect(() => {
    setForcedDisable(false);
  }, []);

  if (forcedDisable) return;

  return isMobile ? (
    <Mobile {...{ user, onNavigate }} />
  ) : (
    <Desktop {...{ user, onNavigate }} />
  );
}

type Props = {
  user: PBUser_t | null;
  onNavigate: (url: { url: string; msg?: string }) => void;
  forcedDisable?: boolean;
};

function Mobile({ user, onNavigate, forcedDisable }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border rounded-t-2xl shadow-2xl">
      <div className="flex items-center justify-around px-3 py-2">
        {navItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1 text-muted-foreground hover:text-foreground h-auto py-1.5 px-2"
            onClick={onNavigate.bind(null, {
              url: item.url,
              msg: item?.msg,
              func: item?.func
            })}>
            <div className="flex items-center justify-center">{item.icon}</div>
            <span className="text-xs font-medium">{item.label}</span>
          </Button>
        ))}
        {user ? (
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1 text-muted-foreground hover:text-foreground h-auto py-1.5 px-2"
            onClick={onNavigate.bind(null, {
              url: "/account",
              msg: "Going to Account"
            })}>
            <div className="flex items-center justify-center">
              <Avatar className="h-5 w-5">
                <AvatarImage
                  src={recordToImageUrl(user)?.toString()}
                  alt={user.name}
                  className="rounded-full"
                />
                <AvatarFallback className="bg-muted text-muted-foreground text-xs rounded-full flex items-center justify-center h-full w-full">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <span className="text-xs font-medium">Account</span>
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="flex flex-col items-center space-y-1 h-auto py-1.5 px-2"
            onClick={onNavigate.bind(null, {
              url: "/login",
              msg: "Going to Login"
            })}>
            <div className="flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Log In</span>
          </Button>
        )}
      </div>
    </div>
  );
}

function Desktop({ user, onNavigate, forcedDisable }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const DEADBAND = 10;

      const currentScrollY = window.scrollY;
      const rect = navbarRef.current?.getBoundingClientRect();

      if (!rect) return;

      if (
        e.clientY > rect.top - DEADBAND &&
        e.clientY < rect.bottom + DEADBAND &&
        e.clientX > rect.left &&
        e.clientX < rect.right
      ) {
        setIsVisible(true);
      } else if (currentScrollY >= 100) {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    handleScroll(); // Initial check on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={navbarRef}
      className={`fixed top-2 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}>
      <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl px-6 py-3">
        <div className="flex items-center justify-between space-x-8">
          <nav className="flex items-center space-x-2">
            {navItems.map((item, index) => (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
                key={index}
                onClick={onNavigate.bind(null, {
                  url: item.url,
                  msg: item?.msg,
                  func: item?.func
                })}>
                <div className="size-4">{item.icon}</div>
                <span className="text-sm font-medium">{item.label}</span>
              </Button>
            ))}
          </nav>

          <div className="flex items-center space-x-3 pl-6 border-l border-border">
            {user ? (
              <>
                <span className="text-sm font-medium text-foreground">
                  {user.name}
                </span>
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={recordToImageUrl(user)?.toString()}
                    alt={user.name}
                    className="rounded-full"
                  />
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs rounded-full flex items-center justify-center h-full w-full">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="flex items-center space-x-2"
                onClick={onNavigate.bind(null, {
                  url: "/auth/login",
                  msg: "Going to Login"
                })}>
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Log In</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
