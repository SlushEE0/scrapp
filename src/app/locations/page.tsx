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
  Phone
} from "lucide-react";

// Define a type for our location data for better type-checking.
type Location = {
  name: string;
  address: string;
  category: "e_waste" | "compost" | "recycle";
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
  {
    name: "Terra Electronic Recycling",
    address: "9353 Activity Rd, San Diego, CA 92126",
    category: "e_waste"
  },
  {
    name: "Dream Electronic Waste",
    address: "4009 Hicock St STE D, San Diego, CA 92110",
    category: "e_waste"
  },
  {
    name: "Goodwill Donation Center (Dell Reconnect)",
    address: "3663 Rosecrans St, San Diego, CA 92110",
    category: "e_waste"
  },
  {
    name: "San Diego E-Waste (Chula Vista)",
    address: "645 Marsat Ct #B, Chula Vista, CA 91911",
    category: "e_waste"
  },
  {
    name: "Urban Corps - Escondido",
    address: "2200 Micro Pl, Escondido, CA 92029",
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
  {
    name: "SA Recycling",
    address: "2498 Commercial St, San Diego, CA 92113",
    category: "recycle"
  },
  {
    name: "EDCO Station Buy Back Center",
    address: "8184 Commercial St, La Mesa, CA 91942",
    category: "recycle"
  },
  {
    name: "Old Town Recycling Center",
    address: "2161 Hancock St, San Diego, CA 92110",
    category: "recycle"
  },
  {
    name: "Pacific Steel Inc.",
    address: "1700 Cleveland Ave, National City, CA 91950",
    category: "recycle"
  },
  {
    name: "Quality Recycling (Poway)",
    address: "13863 Poway Rd, Poway, CA 92064",
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
  {
    name: "Food2Soil Composting Collective",
    address: "Various Drop-off Locations, See Website",
    category: "compost"
  },
  {
    name: "Otay Landfill Composting",
    address: "1700 Maxwell Rd, Chula Vista, CA 91911",
    category: "compost"
  },
  {
    name: "El Corazon Compost Facility",
    address: "3210 Oceanside Blvd, Oceanside, CA 92056",
    category: "compost"
  },
  {
    name: "San Pasqual Valley Soils",
    address: "16111 Old Milky Way, Escondido, CA 92027",
    category: "compost"
  },
  {
    name: "New Roots Community Farm",
    address: "5326 Chollas Pkwy, San Diego, CA 92105",
    category: "compost"
  }
];

// A mapping of category IDs to their display names and icons.
const categories = {
  e_waste: { label: "E-Waste", icon: Battery },
  compost: { label: "Compost", icon: Leaf },
  recycle: { label: "Recycling", icon: Recycle }
};

export default function LocationsPage() {
  // State to manage the active category, search query, loading state, and map URL.
  const [activeCategory, setActiveCategory] = useState<
    "e_waste" | "compost" | "recycle"
  >("recycle");
  const [searchQuery, setSearchQuery] = useState("San Diego, CA");
  const [mapUrl, setMapUrl] = useState(
    "https://www.google.com/maps?q=recycling+centers+near+San+Diego,+CA&output=embed"
  );
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle the search.
  const handleSearch = () => {
    if (!searchQuery) return;
    setIsLoading(true);

    const categoryLabel = categories[activeCategory].label;
    // Construct the new Google Maps URL based on the category and search query.
    const newUrl = `https://www.google.com/maps?q=${encodeURIComponent(
      `${categoryLabel} near ${searchQuery}`
    )}&output=embed`;

    // Simulate a network delay for a better user experience.
    setMapUrl(newUrl);
    setIsLoading(false);
  };

  useEffect(() => {
    handleSearch();
  }, [activeCategory]);

  // Filter the mock locations based on the active category.
  const filteredLocations = mockLocations.filter(
    (loc) => loc.category === activeCategory
  );

  return (
    <div className="dark max-h-screen bg-background flex flex-col lg:flex-row p-4 lg:p-6 gap-6">
      {/* --- Sidebar for Controls and Location List --- */}
      <Card className="w-full lg:w-1/3 lg:max-w-md flex flex-col border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="text-primary" />
            Find Disposal Centers
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col gap-6 overflow-scroll">
          {/* Search Input and Button */}
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

          {/* Category Filter Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(categories).map(([key, { label, icon: Icon }]) => (
              <Button
                key={key}
                variant={activeCategory === key ? "default" : "outline"}
                onClick={() =>
                  setActiveCategory(key as "e_waste" | "compost" | "recycle")
                }
                className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>

          {/* List of Locations */}

          <div className="space-y-4">
            {filteredLocations.map((location, index) => (
              <Card
                key={index}
                className="p-4 bg-muted/50 hover:bg-muted/80 transition-colors">
                <h3 className="font-semibold text-foreground">
                  {location.name}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Compass className="h-4 w-4" /> {location.address}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  {/* <Phone className="h-4 w-4" /> (555) 123-4567 */}
                </p>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* --- Main Content Area for the Map --- */}
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
          src={mapUrl}></iframe>
      </div>
    </div>
  );
}
