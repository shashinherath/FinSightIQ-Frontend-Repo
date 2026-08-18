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
import type { TransactionSide } from "../types/portfolio.types";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  symbol: string;
}

export function AddTransactionDialog({
  open,
  onOpenChange,
  symbol,
}: AddTransactionDialogProps) {
  const [side, setSide] = useState<TransactionSide>("BUY");

  const handleSave = () => {
    toast.success(`${side} transaction saved for ${symbol}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
          <DialogDescription>
            Transactions are immutable once saved. Correct an entry by adding an
            offsetting one.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tx-type">Type</Label>
              <select
                id="tx-type"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={side}
                onChange={(e) => setSide(e.target.value as TransactionSide)}
              >
                <option>BUY</option>
                <option>SELL</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tx-date">Execution date</Label>
              <Input id="tx-date" type="date" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tx-qty">Quantity</Label>
              <Input id="tx-qty" placeholder="10.000000" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tx-price">Price</Label>
              <Input id="tx-price" placeholder="182.44" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tx-fee">Fee</Label>
              <Input id="tx-fee" placeholder="1.00" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tx-note">Note</Label>
              <Input id="tx-note" placeholder="Optional" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save transaction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
