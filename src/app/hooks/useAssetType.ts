import { useAssetStore } from "@/app/store/assetStore";

export function useAssetType() {
  const assetType = useAssetStore((state) => state.assetType);
  const setAssetType = useAssetStore((state) => state.setAssetType);
  const toggleAssetType = useAssetStore((state) => state.toggleAssetType);

  return {
    assetType,
    isStock: assetType === "stock",
    isForex: assetType === "forex",
    setAssetType,
    toggleAssetType,
  };
}
