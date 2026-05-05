import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AssetToggle } from "@/shared/components/AssetToggle";
import { useAssetStore } from "@/app/store/assetStore";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useLocation: () => ({
      pathname: "/app/market",
      search: "",
      hash: "",
      state: null,
      key: "test",
    }),
  };
});

describe("AssetToggle", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    localStorage.clear();
    useAssetStore.setState({ assetType: "stock" });
  });

  it("switches to forex and updates navigation when in market context", () => {
    render(<AssetToggle />);

    fireEvent.click(screen.getByRole("button", { name: "Forex" }));

    expect(useAssetStore.getState().assetType).toBe("forex");
    expect(navigateMock).toHaveBeenCalledWith("/app/forex", { replace: true });
    expect(screen.getByRole("button", { name: "Forex" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
