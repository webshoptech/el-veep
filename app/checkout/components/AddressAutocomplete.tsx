"use client";

import GoogleAddress from "@/interfaces/googleAddress";
import React from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

type Props = {
  onSelectAddress: (address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    lat?: number;
    lng?: number;
  }) => void;
};

export default function AddressAutocomplete({ onSelectAddress }: Props) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
  });

  const handleSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);

      // Parse address components
      const components: Record<string, string> = {};
      results[0].address_components.forEach((comp : GoogleAddress) => {
        const types = comp.types;
        if (types.includes("street_number")) components.street = comp.long_name;
        if (types.includes("route"))
          components.street = (components.street || "") + " " + comp.long_name;
        if (types.includes("locality")) components.city = comp.long_name;
        if (types.includes("administrative_area_level_1"))
          components.state = comp.short_name;
        if (types.includes("postal_code")) components.zip = comp.long_name;
        if (types.includes("country")) components.country = comp.long_name;
      });

      onSelectAddress({
        ...components,
        lat,
        lng,
      });
    } catch (error) {
      console.error("Error fetching geocode:", error);
    }
  };

  return (
    <div className="relative">
      <input
        value={value}
        disabled={!ready}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter your address"
        className="border border-gray-200 p-3 rounded w-full"
      />

      {status === "OK" && (
        <ul className="absolute bg-white border mt-1 rounded shadow w-full z-10 max-h-60 overflow-y-auto">
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(description)}
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}