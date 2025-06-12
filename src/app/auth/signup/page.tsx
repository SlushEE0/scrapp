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
  createUser,
  loginEmailPass,
  loginOAuth_Discord,
  loginOAuth_Google
} from "@/lib/auth";
import { BaseStates } from "@/lib/states";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const { setForcedDisable } = useNavbar();

  const router = useRouter();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password1: "",
    password2: ""
  });

  useEffect(() => {
    setForcedDisable(true);

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

  const handleSubmit = async function () {
    let { name, email, password1, password2 } = userData;

    console.log("Form submitted with:", { name, email, password1, password2 });

    if (!email || !password1 || !password2 || !name) {
      toast.error("Please fill in all fields.");
      return;
    }

    name = name.trim();
    email = email.trim();

    setUserData((d) => ({
      ...d,
      name,
      email
    }));

    const validateName = (name: string) => {
      const re = /[A-Za-z0-9]+$/;
      return re.test(String(name).toLowerCase());
    };

    const validateEmail = (email: string) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };

    if (!name) {
      toast.error("Please enter a display name.");
    }

    if (name.length < 3) {
      toast.error("Display name must be at least 3 characters long.");
    }

    if (!validateName(name)) {
      toast.error("Display name can only contain letters and numbers.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password1 !== password2) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password1.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    toast.dismiss();
    const loader = toast.loading("Logging in...");

    const state1 = await createUser(email, password1, name);
    const state2 =
      state1 === BaseStates.SUCCESS
        ? await loginEmailPass(email, password1)
        : state1;

    toast.dismiss(loader);

    switch (state2) {
      case BaseStates.SUCCESS:
        toast.success("Login successful!");
        router.push("/");
        break;
      case BaseStates.ERROR:
      default:
        toast.error("Email or password is incorrect.");
        break;
    }
  };

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-6">
          <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-foreground">
                Create an Account
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
                    <div className="flex items-center">
                      <Label htmlFor="name" className="text-foreground">
                        Display Name
                      </Label>
                    </div>
                    <Input
                      name="name"
                      type="text"
                      className="bg-input border-border text-foreground"
                      onChange={(e) => {
                        setUserData((d) => ({
                          ...d,
                          name: e.target.value
                        }));
                      }}
                      value={userData.name}
                      autoCorrect="off"
                    />
                  </div>
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
                        setUserData((d) => ({
                          ...d,
                          email: e.target.value
                        }));
                      }}
                      value={userData.email}
                      autoComplete="email"
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password1" className="text-foreground">
                        Password
                      </Label>
                    </div>
                    <Input
                      name="password1"
                      type="password"
                      className="bg-input border-border text-foreground"
                      onChange={(e) => {
                        setUserData((d) => ({
                          ...d,
                          password1: e.target.value
                        }));
                      }}
                      value={userData.password1}
                      autoComplete="current-password"
                      autoCorrect="off"
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password1" className="text-foreground">
                        Confirm Password
                      </Label>
                    </div>
                    <Input
                      name="password1"
                      type="password"
                      className="bg-input border-border text-foreground"
                      onChange={(e) => {
                        setUserData((d) => ({
                          ...d,
                          password2: e.target.value
                        }));
                      }}
                      value={userData.password2}
                      autoComplete="current-password"
                      autoCorrect="off"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleSubmit}>
                    Sign Up
                  </Button>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <a
                    href="/auth/login"
                    className="underline underline-offset-4 text-foreground hover:text-primary">
                    Log In
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
