"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type AddressFields = {
  address_1: string;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
};

type GoogleAddressAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected: (fields: AddressFields) => void;
  countryRestriction?: string;
  inputStyle?: React.CSSProperties;
  required?: boolean;
};

type Suggestion = {
  placeId: string;
  text: string;
};

function extractAddress(place: any): AddressFields {
  const components: Record<string, string> = {};
  for (const c of place.addressComponents || []) {
    const type = c.types?.[0] || "";
    components[type] = c.longText || "";
    if (type === "country") components.country_short = c.shortText || "";
  }

  const streetNumber = components.street_number || "";
  const route = components.route || "";
  const address1 = [streetNumber, route].filter(Boolean).join(" ");
  const city = components.locality || components.postal_town || "";
  const province = components.administrative_area_level_1 || "";
  const postalCode = components.postal_code || "";
  const countryCode = (components.country_short || "").toLowerCase();

  return {
    address_1: address1 || place.formattedAddress?.split(",")[0] || "",
    city,
    province,
    postal_code: postalCode,
    country_code: countryCode,
  };
}

export default function GoogleAddressAutocomplete({
  value,
  onChange,
  onPlaceSelected,
  countryRestriction,
  inputStyle,
  required,
}: GoogleAddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fetchingRef = useRef(false);

  const fetchSuggestions = useCallback(async (input: string) => {
    if (input.length < 2 || fetchingRef.current) return;
    fetchingRef.current = true;
    setActiveIndex(-1);
    setLoading(true);

    try {
      const body: Record<string, any> = {
        input,
        languageCode: "en-GB",
      };
      if (countryRestriction) {
        body.includedRegionCodes = [countryRestriction.toUpperCase()];
      }

      const res = await fetch("/api/places/autocomplete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        fetchingRef.current = false;
        setLoading(false);
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      const data = await res.json();
      const items: Suggestion[] = (data.suggestions || [])
        .map((s: any) => ({
          placeId: s.placePrediction?.placeId,
          text: s.placePrediction?.text?.text || "",
        }))
        .filter((s: Suggestion) => s.placeId);

      setSuggestions(items);
      setShowDropdown(items.length > 0);
    } catch (err) {
      console.error("Places API fetch error:", err);
      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [countryRestriction]);

  const handleSelect = useCallback(
    async (suggestion: Suggestion) => {
      setShowDropdown(false);

      try {
        const res = await fetch(
          `/api/places/details/${encodeURIComponent(suggestion.placeId)}`
        );

        if (!res.ok) return;

        const place = await res.json();
        const fields = extractAddress(place);

        if (fields.address_1) {
          onChange(fields.address_1);
        }
        onPlaceSelected(fields);
        inputRef.current?.blur();
      } catch {
        // fallback — input stays as typed
      }
    },
    [onChange, onPlaceSelected]
  );

  const querySuggestions = useCallback(
    (input: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (input.length >= 2) {
        debounceRef.current = setTimeout(() => fetchSuggestions(input), 250);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    },
    [fetchSuggestions]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    querySuggestions(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === "Escape") setShowDropdown(false);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          handleSelect(suggestions[activeIndex]);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setActiveIndex(-1);
        break;
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const highlightMatch = (text: string) => {
    const parts = text.split(",");
    if (parts.length >= 2) {
      return (
        <span>
          <span style={{ fontWeight: 500, color: "#33383C" }}>{parts[0]}</span>
          <span style={{ color: "#7B8487" }}>{text.slice(parts[0].length)}</span>
        </span>
      );
    }
    return <span style={{ color: "#33383C" }}>{text}</span>;
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (value.length >= 2 && suggestions.length > 0) {
            setShowDropdown(true);
          } else if (value.length >= 2) {
            querySuggestions(value);
          }
        }}
        placeholder="Start typing your address..."
        style={{
          ...inputStyle,
          position: "relative",
          zIndex: 1,
        }}
        autoComplete="off"
        required={required}
      />
      {loading && (
        <div style={{ position: "absolute", right: "8px", top: "6px", zIndex: 2, pointerEvents: "none" }}>
          <div style={{ width: "14px", height: "14px", border: "2px solid #E5E5E5", borderTopColor: "#33383C", borderRadius: "50%" }} />
        </div>
      )}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            zIndex: 1000,
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #E5E5E5",
            borderTop: "none",
            maxHeight: "220px",
            overflowY: "auto",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            borderRadius: "0 0 2px 2px",
            fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif",
            marginTop: "-1px",
          }}
        >
          {suggestions.map((s, i) => (
            <button
              key={s.placeId}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(s);
              }}
              onMouseEnter={() => setActiveIndex(i)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "12px 16px",
                fontSize: "13px",
                fontFamily: "inherit",
                border: "none",
                borderBottom: i < suggestions.length - 1 ? "1px solid #F1F1F1" : "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: i === activeIndex ? "#F8F8F8" : "transparent",
                transition: "background 0.15s",
                outline: "none",
                color: "#33383C",
              }}
              onMouseMove={() => { if (activeIndex !== i) setActiveIndex(i); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color: "#ACB2B4" }}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor" />
              </svg>
              {highlightMatch(s.text)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
