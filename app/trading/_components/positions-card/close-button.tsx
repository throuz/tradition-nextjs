"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/lib/hooks/use-global-store";

const CloseButton = ({ id }: { id: string }) => {
  const { closePosition } = useGlobalStore();

  const onClose = () => {
    closePosition(id);
    toast.success("Close position success");
  };

  return (
    <Button variant="destructive" className="bg-red-700" onClick={onClose}>
      Close
    </Button>
  );
};

export default CloseButton;
