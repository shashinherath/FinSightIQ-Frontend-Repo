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

interface NewPortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewPortfolioDialog({
  open,
  onOpenChange,
}: NewPortfolioDialogProps) {
  const [name, setName] = useState("");

  const handleSave = () => {
    toast.success(name ? `“${name}” created` : "Portfolio created");
    setName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create portfolio</DialogTitle>
          <DialogDescription>
            A portfolio groups holdings in one base currency.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="pf-name">Name</Label>
            <Input
              id="pf-name"
              placeholder="Core growth"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pf-ccy">Base currency</Label>
              <select
                id="pf-ccy"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                defaultValue="USD"
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pf-open">Opened</Label>
              <Input id="pf-open" type="date" />
            </div>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Base currency cannot be changed once holdings exist, because cost
            basis is stored in it.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Create portfolio</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
