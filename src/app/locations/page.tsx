// Make this a client component to allow for user interaction and state changes.
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Battery,
  Leaf,
  Recycle,
  Search,
  Compass,
  Heart
} from "lucide-react";

// Define a type for our location data for better type-checking.
type Location = {
  name: string;
  address: string;
  category: "e_waste" | "compost" | "recycle" | "donation";
};

// UPDATED: Mock data now reflects real locations in San Diego County.
const mockLocations: Location[] = [
  // E-Waste Locations
  {
    name: "San Diego E-Waste Recycling",
    address: "8222 Ronson Rd, San Diego, CA 92111",
    category: "e_waste"
  },
  {
    name: "Urban Corps - Midway",
    address: "3021 Moore St, San Diego, CA 92110",
    category: "e_waste"
  },

  // Recycling Locations
  {
    name: "Miramar Recycling Center",
    address: "5180 Convoy St, San Diego, CA 92111",
    category: "recycle"
  },
  {
    name: "Allan Company Recycling",
    address: "6060 Federal Blvd, San Diego, CA 92114",
    category: "recycle"
  },

  // Compost Locations
  {
    name: "Miramar Greenery Composting",
    address: "5180 Convoy St, San Diego, CA 92111",
    category: "compost"
  },
  {
    name: "Solana Center for Environmental Innovation",
    address: "137 N El Camino Real, Encinitas, CA 92024",
    category: "compost"
  },

  // Donation Locations
  {
    name: "Goodwill Donation Center",
    address: "3663 Rosecrans St, San Diego, CA 92110",
    category: "donation"
  },
  {
    name: "Salvation Army Thrift Store & Donation Center",
    address: "3350 Sports Arena Blvd, San Diego, CA 92110",
    category: "donation"
  },
  {
    name: "Father Joe's Villages Donation Center",
    address: "815 33rd St, San Diego, CA 92102",
    category: "donation"
  },
  {
    name: "Vietnam Veterans of America Donation Center",
    address: "7050 Miramar Rd, San Diego, CA 92121",
    category: "donation"
  }
];

// A mapping of category IDs to their display names and icons.
const categories = {
  e_waste: { label: "E-Waste", icon: Battery },
  compost: { label: "Compost", icon: Leaf },
  recycle: { label: "Recycling", icon: Recycle },
  donation: { label: "Donation", icon: Heart }
};

export default function LocationsPage() {
  const [activeCategory, setActiveCategory] = useState<
    "e_waste" | "compost" | "recycle" | "donation"
  >("recycle");
  const [searchQuery, setSearchQuery] = useState("San Diego, CA");
  const [mapUrl, setMapUrl] = useState(
    "https://www.google.com/maps?q=recycling+centers+near+San+Diego,+CA&output=embed"
  );
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle search.
  const handleSearch = () => {
    if (!searchQuery) return;
    setIsLoading(true);

    const categoryLabel = categories[activeCategory].label;
    const newUrl = `https://www.google.com/maps?q=${encodeURIComponent(
      `${categoryLabel} centers near ${searchQuery}`
    )}&output=embed`;

    setMapUrl(newUrl);
    setIsLoading(false);
  };

  useEffect(() => {
    handleSearch();
  }, [activeCategory]);

  const filteredLocations = mockLocations.filter(
    (loc) => loc.category === activeCategory
  );

  return (
    <div className="dark max-h-screen bg-background flex flex-col lg:flex-row p-4 lg:p-6 gap-6">
      {/* Sidebar */}
      <Card className="w-full lg:w-1/3 lg:max-w-md flex flex-col border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="text-primary" /> Find Disposal & Donation Centers
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col gap-6 overflow-scroll">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Enter city or zip code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(categories).map(([key, { label, icon: Icon }]) => (
              <Button
                key={key}
                variant={activeCategory === key ? "default" : "outline"}
                onClick={() =>
                  setActiveCategory(
                    key as "e_waste" | "compost" | "recycle" | "donation"
                  )
                }
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" /> {label}
              </Button>
            ))}
          </div>

          {/* Locations List */}
          <div className="space-y-4">
            {filteredLocations.map((location, index) => (
              <Card
                key={index}
                className="p-4 bg-muted/50 hover:bg-muted/80 transition-colors"
              >
                <h3 className="font-semibold text-foreground">{location.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Compass className="h-4 w-4" /> {location.address}
                </p>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Map Display */}
      <div className="flex-grow rounded-lg overflow-hidden relative shadow-lg">
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
            <Skeleton className="w-full h-full" />
          </div>
        )}
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={mapUrl}
        ></iframe>
      </div>
    </div>
  );
}
