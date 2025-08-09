"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import { useIsHydrated } from "@/hooks/useIsHydrated";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavbar } from "@/hooks/useNavbar";
import { recordToImageUrl } from "@/lib/pbaseClient";
import { logout } from "@/lib/auth";
import type { pb_UsersColItem } from "@/lib/types";

import {
  User,
  Signature,
  Construction,
  Menu,
  MessageSquareQuote
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";

const NAV_ITEMS = [
  {
    onlyHomePersist: true,
    icon: <User className="h-5 w-5" />,
    label: "Dashboard",
    url: "/dashboard",
    msg: "Going to your Dashboard",
    func: () => {
      toast(
        <div className="flex gap-4">
          <Construction className="size-4 text-yellow-600" />
          <span>Under Construction</span>
        </div>
      );
      return false;
    }
  },
  {
    icon: <MessageSquareQuote className="h-5 w-5" />,
    label: "Chat",
    url: "/chat",
    msg: "Lets Scrapp!"
  },
  {
    onlyHomePersist: true,
    icon: <Signature className="h-5 w-5" />,
    label: "(testing only) Sign Out",
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

const PROFILE_ITEM = {
  url: "/user/profile",
  msg: "Going to Profile"
};

const LOGIN_ITEM = {
  url: "/auth/login",
  msg: "Going to Login"
};

export type NavItems = typeof NAV_ITEMS;

type ChildProps = {
  user: pb_UsersColItem | null;
  navItems: typeof NAV_ITEMS;
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
    ? NAV_ITEMS.filter((item) => item.onlyHomePersist)
    : NAV_ITEMS;

  const onNavigate = function ({
    url,
    msg,
    func = () => true
  }: {
    url: string;
    msg?: string;
    func?: () => boolean;
  }) {
    if (!func()) return;

    toast(`${msg}`);
    router.push(url);
  };

  if (state.forcedDisable) return;

  return isSmallScreen ? (
    <Mobile {...state} {...{ navItems, user, onNavigate }} />
  ) : (
    <Desktop {...state} {...{ navItems, user, onNavigate }} />
  );
}

function Mobile({ navItems, user, onNavigate }: ChildProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (item: {
    url: string;
    msg?: string;
    func?: () => boolean;
  }) => {
    setIsOpen(false);
    onNavigate(item);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 right-4 z-50 h-10 w-10 rounded-lg shadow-lg bg-card/95 backdrop-blur-xl border border-border hover:bg-muted">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle hidden>Navigation</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-4 space-y-4">
          {/* User Section */}
          {user ? (
            <div className="flex items-center space-x-3 pb-4 border-b border-border">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={recordToImageUrl(user)?.toString()}
                  alt={user.name || "User"}
                  className="rounded-full"
                />
                <AvatarFallback className="bg-muted text-muted-foreground text-base rounded-full flex items-center justify-center h-full w-full">
                  {(user.name || "U").charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-base font-medium text-foreground">
                  {user.name || "Unknown User"}
                </span>
              </div>
            </div>
          ) : null}

          {/* Navigation Items */}
          <div className="space-y-1">
            {navItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left h-12 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                onClick={() =>
                  handleNavigation({
                    url: item.url,
                    msg: item?.msg,
                    func: item?.func
                  })
                }>
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Button>
            ))}

            <Separator className="my-4" />

            {/* Account/Login Button */}
            {user ? (
              <Button
                variant="ghost"
                className="w-full justify-start text-left h-12 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                onClick={() => handleNavigation(PROFILE_ITEM)}>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Account</span>
                </div>
              </Button>
            ) : (
              <Button
                variant="default"
                className="w-full justify-start text-left h-12"
                onClick={() => handleNavigation(LOGIN_ITEM)}>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Log In</span>
                </div>
              </Button>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
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
                  href={PROFILE_ITEM.url}
                  className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out opacity-100 group">
                  <div className="hidden flex-col items-start md:flex">
                    <span className="text-sm font-medium text-foreground underline transition-all duration-200 ease-in-out decoration-transparent group-hover:decoration-current">
                      {user.name || "Unknown User"}
                    </span>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={recordToImageUrl(user)?.toString()}
                      alt={user.name || "User"}
                      className="rounded-full"
                    />
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs rounded-full flex items-center justify-center h-full w-full">
                      {(user.name || "U").charAt(0)}
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
                  onClick={onNavigate.bind(null, LOGIN_ITEM)}>
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
