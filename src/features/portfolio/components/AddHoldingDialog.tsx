import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

interface AddHoldingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddHoldingDialog({
  open,
  onOpenChange,
}: AddHoldingDialogProps) {
  const [symbol, setSymbol] = useState("");

  const handleSave = () => {
    toast.success(
      symbol
        ? `${symbol.toUpperCase()} added to the portfolio`
        : "Holding added",
    );
    setSymbol("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add holding</DialogTitle>
          <DialogDescription>
            The holding and its opening BUY transaction are created together.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="hold-symbol">Symbol</Label>
            <Input
              id="hold-symbol"
              placeholder="Search symbols"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="hold-qty">Quantity</Label>
              <Input id="hold-qty" placeholder="120.000000" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="hold-price">Entry price</Label>
              <Input id="hold-price" placeholder="151.46" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="hold-fee">Fee</Label>
              <Input id="hold-fee" placeholder="1.25" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="hold-date">Execution date</Label>
              <Input id="hold-date" type="date" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save holding</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
