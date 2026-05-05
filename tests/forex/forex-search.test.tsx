import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ForexSearchInput } from "@/features/forex/components/ForexSearchInput";

const selectMock = vi.fn();

vi.mock("@/features/forex/query/forex.query", () => ({
  useForexPairs: () => ({
    data: [
      {
        symbol: "EUR/USD",
        baseCurrency: "EUR",
        quoteCurrency: "USD",
        name: "EUR / USD",
        region: "Majors",
        popularity: 100,
      },
    ],
  }),
  useForexSearchPairs: () => ({
    data: [
      {
        symbol: "EUR/USD",
        displayName: "EUR / USD",
        baseCurrency: "EUR",
        quoteCurrency: "USD",
        price: 1.0954,
        spread: 0.00012,
        dailyChangePercent: 0.24,
        popularity: 100,
        trend: "UP",
      },
    ],
  }),
}));

describe("ForexSearchInput", () => {
  beforeEach(() => {
    selectMock.mockReset();
  });

  it("shows popular pairs and supports keyboard selection", () => {
    render(<ForexSearchInput onSelect={selectMock} />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "EUR" },
    });

    fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" });

    expect(selectMock).toHaveBeenCalledWith("EUR/USD");
  });
});
