import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { useForexPairs, useForexSearchPairs } from "../query/forex.query";
import { ForexSearchDropdown } from "./ForexSearchDropdown";
import type { ForexSearchResult } from "../types/forex.types";

export function ForexSearchInput({
  onSelect,
  placeholder = "Search currency pairs (EUR/USD)",
}: {
  onSelect?: (pair: string) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { data: popularPairs = [] } = useForexPairs();
  const { data: results = [] } = useForexSearchPairs(query, 8, {
    enabled: query.trim().length > 0,
    debounceMs: 200,
  });

  const suggestions = useMemo<ForexSearchResult[]>(() => {
    if (query.trim()) return results;
    return popularPairs.slice(0, 5).map((pair) => ({
      symbol: pair.symbol,
      displayName: pair.name,
      baseCurrency: pair.baseCurrency,
      quoteCurrency: pair.quoteCurrency,
      price: Number((1 + pair.popularity / 100).toFixed(4)),
      spread: 0.00015,
      dailyChangePercent: 0,
      popularity: pair.popularity,
      trend: "SIDEWAYS",
    }));
  }, [query, popularPairs, results]);

  // Reset active index immediately when user changes the query
  // (avoid calling setState synchronously inside an effect)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(0);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSelect = (result: ForexSearchResult) => {
    onSelect?.(result.symbol);
    setQuery(result.symbol);
    setIsOpen(false);
    setActiveIndex(0);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            requestAnimationFrame(() => {
              if (!containerRef.current?.contains(document.activeElement)) {
                setIsOpen(false);
                setActiveIndex(0);
              }
            });
          }}
          onKeyDown={(event) => {
            if (suggestions.length === 0) return;
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setIsOpen(true);
              setActiveIndex((index) => (index + 1) % suggestions.length);
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setIsOpen(true);
              setActiveIndex((index) =>
                index === 0 ? suggestions.length - 1 : index - 1,
              );
            }
            if (event.key === "Enter" && suggestions[activeIndex]) {
              event.preventDefault();
              handleSelect(suggestions[activeIndex]);
            }
            if (event.key === "Escape") {
              setIsOpen(false);
              setActiveIndex(0);
            }
          }}
          placeholder={placeholder}
          className="h-12 rounded-xl border-border/30 bg-background pl-10 shadow-none focus-visible:ring-1 focus-visible:ring-primary/25 focus-visible:ring-offset-0"
          aria-label="Search currency pairs"
          role="combobox"
          aria-expanded={isOpen && suggestions.length > 0}
          aria-controls="forex-search-results"
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <div id="forex-search-results" role="listbox">
          <ForexSearchDropdown
            results={suggestions}
            activeIndex={activeIndex}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
}
