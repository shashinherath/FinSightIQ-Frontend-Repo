import { describe, expect, it, beforeEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import AlertsPage from "@/features/alerts/pages/AlertsPage";
import { useAlertsStore } from "@/features/alerts/store/alertsStore";

const useNotificationsMock = vi.fn();

vi.mock("@/features/alerts/query/alerts.query", () => ({
  useNotifications: () => useNotificationsMock(),
}));

describe("AlertsPage", () => {
  beforeEach(() => {
    useNotificationsMock.mockReset();
    useAlertsStore.setState({ rules: [] });
  });

  it("shows the empty state when there are no alert rules", () => {
    useNotificationsMock.mockReturnValue({ data: [] });

    render(<AlertsPage />);

    expect(screen.getByText("No alerts configured")).toBeInTheDocument();
    expect(screen.getByText("Create alert")).toBeInTheDocument();
  });

  it("adds and removes alert rules from the store", () => {
    useNotificationsMock.mockReturnValue({ data: [] });

    render(<AlertsPage />);

    fireEvent.click(screen.getByRole("button", { name: "Add Rule" }));
    expect(screen.getByText("New Rule")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(screen.queryByText("New Rule")).not.toBeInTheDocument();
  });

  it("renders notification bodies", () => {
    useNotificationsMock.mockReturnValue({
      data: [
        {
          id: "notif-1",
          title: "Price target hit",
          body: "AAPL moved above your threshold",
          category: "alerts",
          priority: "high",
          read: false,
          createdAt: Date.now(),
        },
      ],
    });

    render(<AlertsPage />);

    expect(screen.getByText("Price target hit")).toBeInTheDocument();
    expect(
      screen.getByText("AAPL moved above your threshold"),
    ).toBeInTheDocument();
  });
});
