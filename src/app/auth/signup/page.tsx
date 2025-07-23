"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
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
import Image from "next/image";
import PasswordBlock from "../PasswordBlock";

import { useIsHydrated } from "@/hooks/useIsHydrated";
import { useNavbar } from "@/hooks/useNavbar";
import { loginOAuth, signupEmailPass } from "@/lib/auth";
import { BaseStates, SignupStates } from "@/lib/states";
import SkeletonSignupForm from "./SkeletonSignupForm";

export default function SignupForm() {
  const { setRenderOnlyHome, setDefaultShown } = useNavbar();

  const router = useRouter();
  const isHydrated = useIsHydrated();

  const redirectToHome = useCallback(() => {
    console.log("Redirecting ...");

    router.prefetch("/");

    setTimeout(() => {
      router.push("/");
      toast.dismiss();
    }, 300);
  }, [router]);

  const handleGoogleOAuth = async function () {
    const loader = toast.loading("Continue on the popup ...");

    const state = await loginOAuth("google");

    toast.dismiss(loader);

    switch (state) {
      case BaseStates.SUCCESS:
        toast.success("Login successful!");
        redirectToHome();
        break;
      case BaseStates.ERROR:
      default:
        toast.error("Something went wrong :(");
        break;
    }
  };

  const handleDiscordOAuth = async function () {
    const loader = toast.loading("Continue on the popup ...");

    const state = await loginOAuth("discord");

    toast.dismiss(loader);

    switch (state) {
      case BaseStates.SUCCESS:
        toast.success("Login successful!");
        redirectToHome();
        break;
      case BaseStates.ERROR:
      default:
        toast.error("Something went wrong :(");
        break;
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      let name = formData.get("name")?.toString();
      let email = formData.get("email")?.toString();
      let password1 = formData.get("password1")?.toString();
      let password2 = formData.get("password2")?.toString();

      console.log("Form submitted with:", {
        name,
        email,
        password1,
        password2
      });

      if (!name || !email || !password1 || !password2) {
        toast.error("Please fill in all fields.");
        return;
      }

      name = name.trim();
      email = email.trim();

      toast.dismiss();
      const loader = toast.loading("Creating account...");

      let state = SignupStates.ERR_UNKNOWN;
      state = await signupEmailPass(email, password1, password2, name);

      toast.dismiss(loader);

      switch (state) {
        case SignupStates.SUCCESS:
          toast.success("Account created successfully!");
          redirectToHome();
          break;
        case SignupStates.ERR_EMAIL_NOT_PROVIDED:
          toast.error("Email is required.");
          break;
        case SignupStates.ERR_PASSWORD_NOT_PROVIDED:
          toast.error("Password is required.");
          break;
        case SignupStates.ERR_NAME_NOT_PROVIDED:
          toast.error("Display name is required.");
          break;
        case SignupStates.ERR_INVALID_EMAIL:
          toast.error("Please enter a valid email address.");
          break;
        case SignupStates.ERR_INVALID_NAME:
          toast.error("Display name can only contain letters and numbers.");
          break;
        case SignupStates.ERR_NAME_TOO_SHORT:
          toast.error("Display name must be at least 3 characters long.");
          break;
        case SignupStates.ERR_PASSWORD_TOO_SHORT:
          toast.error("Password must be at least 8 characters long.");
          break;
        case SignupStates.ERR_PASSWORDS_DONT_MATCH:
          toast.error("Passwords do not match.");
          break;
        case SignupStates.ERR_ALREADY_EXISTS:
          toast.error("An account with this email already exists.");
          toast.info(
            "Looks like you have an account. Do you want to log in instead?",
            {
              duration: 10000,
              action: {
                label: "Take me there",
                onClick: () => {
                  router.push("/auth/login");
                }
              }
            }
          );
          break;
        case SignupStates.ERR_UNKNOWN:
        default:
          toast.error("Something went wrong. Please try again later.");
          break;
      }
    },
    [redirectToHome, router]
  );

  useEffect(() => {
    setRenderOnlyHome(true);
    setDefaultShown(false);

    return () => {
      setRenderOnlyHome(false);
      setDefaultShown(true);
    };
  }, [handleSubmit, setDefaultShown, setRenderOnlyHome]);

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
                    <Image
                      src="/google.svg"
                      alt="Google Logo"
                      className="mr-2"
                      width={16}
                      height={16}
                    />
                    Continue with Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleDiscordOAuth}>
                    <Image
                      src="/discord.svg"
                      alt="Discord Logo"
                      className="mr-2"
                      width={16}
                      height={16}
                    />
                    Continue with Discord
                  </Button>
                </div>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                {isHydrated ? (
                  <form className="grid gap-6" onSubmit={handleSubmit}>
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
                        autoComplete="email"
                      />
                    </div>
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="password1" className="text-foreground">
                          Password
                        </Label>
                      </div>
                      <PasswordBlock
                        name="password1"
                        className="bg-input border-border text-foreground"
                        autoComplete="new-password"
                        autoCorrect="off"
                      />
                    </div>
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="password2" className="text-foreground">
                          Confirm Password
                        </Label>
                      </div>
                      <PasswordBlock
                        name="password2"
                        className="bg-input border-border text-foreground"
                        autoComplete="new-password"
                        autoCorrect="off"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Sign Up
                    </Button>
                  </form>
                ) : (
                  <SkeletonSignupForm />
                )}
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
