"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import { useIsHydrated } from "@/hooks/useIsHydrated";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavbar } from "@/hooks/useNavbar";
import { recordToImageUrl } from "@/lib/pbaseClient";
import { logout } from "@/lib/auth";
import type { t_pb_User } from "@/lib/types";

import { User, FileSpreadsheet, Clock, Signature } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import NavbarSkeleton from "./skeletons/NavbarSkeleton";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const allItems = [
  {
    onlyHomePersist: true,
    icon: <User className="h-5 w-5" />,
    label: "Home",
    url: "/",
    msg: "Going Home"
  },
  {
    icon: <FileSpreadsheet className="h-5 w-5" />,
    label: "Budget",
    url: "/budget",
    msg: "Going to the Budget Sheet"
  },
  {
    icon: <Clock className="h-5 w-5" />,
    label: "Outreach",
    url: "/outreach",
    msg: "Going to the Outreach Sheet"
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

export type NavItems = typeof allItems;

type ChildProps = {
  user: t_pb_User | null;
  navItems: typeof allItems;
  onNavigate: (url: { url: string; msg?: string }) => void;
  defaultToShown: boolean;
};

export default function Navbar({}) {
  const router = useRouter();

  const { isSmallScreen, hasTouch } = useIsMobile(true);
  const state = useNavbar();
  const isHydrated = useIsHydrated();

  const { user } = useUser();

  if (!isHydrated) return null; //<NavbarSkeleton navItems={allItems} />;

  const navItems = state.renderOnlyHome
    ? allItems.filter((item) => item.onlyHomePersist)
    : allItems;

  const onNavigate = function ({
    url,
    msg,
    func = () => true
  }: {
    url: string;
    msg?: string;
    func?: () => boolean;
  }) {
    toast(`${msg}`);

    if (func()) router.push(url);
  };

  if (state.forcedDisable) return;

  return isSmallScreen ? (
    <Mobile {...state} {...{ navItems, user, onNavigate }} />
  ) : (
    <Desktop {...state} {...{ navItems, user, onNavigate }} />
  );
}

function Mobile({ navItems, user, onNavigate }: ChildProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border rounded-t-2xl shadow-2xl">
      <div className="flex items-center justify-around px-3 py-2 transition-all duration-300 ease-in-out">
        {navItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1 text-muted-foreground hover:text-foreground h-auto py-1.5 px-2 transition-all duration-300 ease-in-out opacity-100"
            onClick={onNavigate.bind(null, {
              url: item.url,
              msg: item?.msg,
              func: item?.func
            })}>
            <div className="flex items-center justify-center transition-all duration-300 ease-in-out">
              {item.icon}
            </div>
            <span className="text-xs font-medium transition-all duration-300 ease-in-out">
              {item.label}
            </span>
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

function Desktop({ navItems, user, onNavigate, defaultToShown }: ChildProps) {
  const [isVisible, setIsVisible] = useState(true);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY >= 100) {
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
      } else if (currentScrollY >= 100 || !defaultToShown) {
        setIsVisible(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    if (defaultToShown) {
      window.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [defaultToShown, navbarRef, setIsVisible]);

  useEffect(() => {
    setIsVisible(defaultToShown);
  }, [defaultToShown]);

  return (
    <div
      ref={navbarRef}
      className={`fixed top-2 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out w-max ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}>
      <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl px-6 py-3 transition-all duration-300 ease-in-out">
        <div className="flex items-center justify-between space-x-8 transition-all duration-300 ease-in-out">
          <nav className="flex items-center space-x-2 transition-all duration-300 ease-in-out">
            {navItems.map((item, index) => (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out opacity-100"
                key={index}
                onClick={onNavigate.bind(null, {
                  url: item.url,
                  msg: item?.msg,
                  func: item?.func
                })}>
                <div className="size-4 transition-all duration-300 ease-in-out">
                  {item.icon}
                </div>
                <span className="text-sm font-medium transition-all duration-300 ease-in-out">
                  {item.label}
                </span>
              </Button>
            ))}

            {user ? (
              <div className="flex items-center space-x-3 pl-6 ml-2 border-l border-border">
                <Link
                  href="/profile"
                  className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out opacity-100 group">
                  <div className="hidden flex-col items-start md:flex">
                    <span className="text-sm font-medium text-foreground underline transition-all duration-200 ease-in-out decoration-transparent group-hover:decoration-current">
                      {user.name}
                    </span>
                    <span className="text-sm font-sm text-muted-foreground">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
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
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3 pl-7 ml-2 border-l border-border">
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center space-x-3"
                  onClick={onNavigate.bind(null, {
                    url: "/auth/login",
                    msg: "Going to Login"
                  })}>
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Log In</span>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
