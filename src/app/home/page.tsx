// To make this a client component, we add this directive at the top.
// This allows us to use React hooks like useState, useEffect, and useRef.
"use client";

// Import necessary React hooks and components.
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Recycle, Globe, Trash2, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

// This is a custom hook to detect if an element is visible on the screen.
// It uses the Intersection Observer API for performance.
const useOnScreen = (options: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Set visibility state based on whether the element is intersecting the viewport.
      if (entry.isIntersecting) {
        setIsVisible(true);
        // We can unobserve after it becomes visible to prevent re-triggering.
        if (ref.current) {
            observer.unobserve(ref.current);
        }
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options]);

  return [ref, isVisible] as const;
};

// A component for an animated statistic card.
// It uses the useOnScreen hook to trigger a count-up animation.
// animatedstastic1 = fast stastic for the middle data point. increments by 5 each time
const AnimatedStatisticFast = ({
  icon: Icon,
  value,
  label,
  suffix = "",
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useOnScreen({ threshold: 0.2 });

  useEffect(() => {
    if (isVisible) {
      let start = 0;
      const end = value;
      // If the value is 0, just set it and return.
      if (start === end) return;

      // Find duration per integer
      let duration = 1500 / end;
      if (end > 1000) duration = 0.5;
      if (end < 100) duration = 20;


      const timer = setInterval(() => {
        start += 5;
        if (start > end) start = end; // Prevent overshoot
        setCount(start);
        if (start === end) {
          clearInterval(timer);
        }
      }, duration);

      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  return (
    <div
      ref={ref}
      className={cn(
        "transform transition-all duration-1000 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      <Card className="bg-card/50 text-center p-6">
        <Icon className="mx-auto h-12 w-12 text-primary mb-4" />
        <p className="text-4xl font-bold text-foreground">
          {count}
          {suffix}
        </p>
        <p className="text-muted-foreground">{label}</p>
      </Card>
    </div>
  );
};

// faster

const AnimatedStatistic = ({
  icon: Icon,
  value,
  label,
  suffix = "",
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useOnScreen({ threshold: 0.2 });

  useEffect(() => {
    if (isVisible) {
      let start = 0;
      const end = value;
      // If the value is 0, just set it and return.
      if (start === end) return;

      // Find duration per integer
      let duration = 1500 / end;
      if (end > 1000) duration = 0.5;
      if (end < 100) duration = 20;


      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) {
          clearInterval(timer);
        }
      }, duration);

      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  return (
    <div
      ref={ref}
      className={cn(
        "transform transition-all duration-1000 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      <Card className="bg-card/50 text-center p-6">
        <Icon className="mx-auto h-12 w-12 text-primary mb-4" />
        <p className="text-4xl font-bold text-foreground">
          {count}
          {suffix}
        </p>
        <p className="text-muted-foreground">{label}</p>
      </Card>
    </div>
  );
};

// super faster

const AnimatedStatisticFastFast = ({
  icon: Icon,
  value,
  label,
  suffix = "",
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useOnScreen({ threshold: 0.2 });

  useEffect(() => {
    if (isVisible) {
      let start = 0;
      const end = value;
      // If the value is 0, just set it and return.
      if (start === end) return;

      // Find duration per integer
      let duration = 1500 / end;
      if (end > 1000) duration = 0.5;
      if (end < 100) duration = 20;


      const timer = setInterval(() => {
        start += 10;
        if (start > end) start = end; // Prevent overshoot
        setCount(start);
        if (start === end) {
          clearInterval(timer);
        }
      }, duration);

      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  return (
    <div
      ref={ref}
      className={cn(
        "transform transition-all duration-1000 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      <Card className="bg-card/50 text-center p-6">
        <Icon className="mx-auto h-12 w-12 text-primary mb-4" />
        <p className="text-4xl font-bold text-foreground">
          {count}
          {suffix}
        </p>
        <p className="text-muted-foreground">{label}</p>
      </Card>
    </div>
  );
};


// The main component for your home page.
export default function HomePage() {
  const [mainCardRef, isMainCardVisible] = useOnScreen({ threshold: 0.1 });
  // Create a ref for the statistics section
  const statsSectionRef = useRef<HTMLElement>(null);

  // Function to handle smooth scrolling
  const handleScrollDown = () => {
    statsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-screen p-6 text-center relative">
        <div
          ref={mainCardRef}
          className={cn(
            "transform transition-all duration-1000 ease-out",
            isMainCardVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          <Card className="w-full max-w-3xl bg-card/80 backdrop-blur-xl border-none shadow-2xl">
            <CardHeader>
              <CardTitle className="text-5xl font-bold text-primary tracking-tight">
                scrapp
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                Your Smart Waste Disposal Helper
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-xl text-foreground/90">
                Confused about recycling? Scrapp makes it simple. Just snap a photo, and we'll tell you exactly how to dispose of your items properly. Then, we'll tell you where you can dispose of the item. 
              </p>
              <Button asChild size="lg" className="mt-4">
                <Link href="/">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Scroll Down Arrow */}
        <div
          onClick={handleScrollDown}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer animate-bob"
        >
          <ArrowDown className="w-8 h-8 text-muted-foreground" />
        </div>
      </section>

      {/* Statistics Section */}
      <section ref={statsSectionRef} className="py-20 bg-muted/20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Why It Matters</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Improper waste disposal has a huge impact on our planet. Your choices make a difference, and Scrapp is here to empower them.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedStatistic
              icon={Recycle}
              value={45}
              suffix="%"
              label="of global municipal waste fails to reach a facility capable of proper management each year."
            />
            <AnimatedStatisticFast
              icon={Trash2}
              value={2000}
              suffix="M"
              label="tons of municipal solid waste are improperly managed or uncollected each year."
            />
            <AnimatedStatisticFastFast
              icon={Globe}
              value={4500}
              suffix="B"
              label="cigarette butts are improperly discarded annually worldwide, making it the most littered item on the planet."
            />
          </div>
        </div>
      </section>

       {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground text-sm">
        <p>Making waste disposal less confusing, one photo at a time.</p>
        <p>Data from <a href="https://blogs.worldbank.org/en/sustainablecities/how-the-world-bank-is-tackling-the-growing-global-waste-crisis" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">World Bank</a></p>
      </footer>
    </div>
  );
}

