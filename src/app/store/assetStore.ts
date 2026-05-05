import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AssetType = "stock" | "forex";

interface AssetState {
  assetType: AssetType;
  setAssetType: (assetType: AssetType) => void;
  toggleAssetType: () => void;
}

export const useAssetStore = create<AssetState>()(
  persist(
    (set) => ({
      assetType: "stock",
      setAssetType: (assetType) => set({ assetType }),
      toggleAssetType: () =>
        set((state) => ({
          assetType: state.assetType === "stock" ? "forex" : "stock",
        })),
    }),
    {
      name: "finsightiq-asset-type",
      partialize: (state) => ({ assetType: state.assetType }),
    },
  ),
);
