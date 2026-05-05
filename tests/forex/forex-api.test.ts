import { describe, expect, it } from "vitest";
import {
  getForexHistoricalRates,
  getForexPairs,
  getLiveForexRate,
  searchForexPairs,
} from "@/features/forex/api/forex.api";

describe("forex api", () => {
  it("returns major pairs", async () => {
    const pairs = await getForexPairs();

    expect(pairs.length).toBeGreaterThan(0);
    expect(pairs[0]?.symbol).toContain("/");
  });

  it("returns a live forex quote", async () => {
    const quote = await getLiveForexRate("EUR/USD");

    expect(quote.symbol).toBe("EUR/USD");
    expect(quote.price).toBeGreaterThan(0);
    expect(quote.spread).toBeGreaterThan(0);
  });

  it("returns historical rates and search results", async () => {
    const historical = await getForexHistoricalRates("EUR/USD", "1D");
    const results = await searchForexPairs("EUR", 5);

    expect(historical.data.length).toBeGreaterThan(0);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.symbol).toContain("EUR");
  });
});
