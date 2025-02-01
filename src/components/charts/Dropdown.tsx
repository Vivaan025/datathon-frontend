"use client";

import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function CityDropdown() {
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");

  useEffect(() => {
    // Dummy data
    const dummyData = ["New York", "Los Angeles", "Chicago", "Houston", "San Francisco"];
    setCities(dummyData);
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-xl">
      <label className="block text-white text-sm font-semibold mb-2 tracking-wide">
        Select a City:
      </label>
      <div className="relative">
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="block w-full p-3 pr-10 border border-transparent rounded-lg bg-white/20 backdrop-blur-lg text-gray-900 shadow-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 appearance-none"
        >
          <option value="" disabled>Select a city</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ">
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}