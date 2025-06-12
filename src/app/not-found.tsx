"use client";

import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Search, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default function NotFound() {
  const router = useRouter();

  const handleHome = function () {
    router.push("/");
  };

  const handleBack = function () {
    router.back();
  };

  const handleContactUs = () => {
    console.log("Contact us clicked");
  };

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl text-foreground">
              Page Not Found
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button
                variant="outline"
                onClick={handleHome}
                className="w-full border !border-primary">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>

              <Button variant="outline" onClick={handleBack} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Need help?
                </span>
              </div>

              <Button
                variant="outline"
                onClick={handleContactUs}
                className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Us
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Error Code:{" "}
                <span className="font-mono text-foreground">404</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
