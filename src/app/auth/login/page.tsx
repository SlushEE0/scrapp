"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useNavbar } from "@/hooks/useNavbar";
import {
  loginEmailPass,
  loginOAuth_Discord,
  loginOAuth_Google
} from "@/lib/auth";

export default function LoginForm() {
  const { setForcedDisable } = useNavbar();

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    // setForcedDisable(true);

    window.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    });

    return () => {
      setForcedDisable(false);
    };
  }, []);

  const handleGoogleOAuth = function () {
    loginOAuth_Google();
  };

  const handleDiscordOAuth = function () {
    loginOAuth_Discord();
  };

  const handleSubmit = function () {
    const { email, password } = loginData;

    console.log("Form submitted with:", { email, password });

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    const validateEmail = (email: string) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 5) {
      toast.error("Password must be at least 5 characters long.");
      return;
    }

    toast.dismiss();
    toast.loading("Logging in...");

    loginEmailPass(email, password);
  };

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-6">
          <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-foreground">
                Welcome back
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Use your Google or Discord account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleOAuth}>
                    <img
                      src="/google.svg"
                      alt="Google Logo"
                      className="h-4 w-4 mr-2"
                    />
                    Continue with Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleDiscordOAuth}>
                    <img
                      src="/discord.svg"
                      alt="Discord Logo"
                      className="h-4 w-4 mr-2"
                    />
                    Continue with Discord
                  </Button>
                </div>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email" className="text-foreground">
                      Email
                    </Label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                      onChange={(e) => {
                        setLoginData((d) => ({
                          ...d,
                          email: e.target.value
                        }));
                      }}
                      value={loginData.email}
                      autoComplete="email"
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password" className="text-foreground">
                        Password
                      </Label>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline text-muted-foreground hover:text-foreground">
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      name="password"
                      type="password"
                      className="bg-input border-border text-foreground"
                      placeholder="********"
                      onChange={(e) => {
                        setLoginData((d) => ({
                          ...d,
                          password: e.target.value
                        }));
                      }}
                      value={loginData.password}
                      autoComplete="current-password"
                      autoCorrect="off"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleSubmit}>
                    Login
                  </Button>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <a
                    href="#"
                    className="underline underline-offset-4 text-foreground hover:text-primary">
                    Sign up
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
