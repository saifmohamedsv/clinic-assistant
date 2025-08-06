import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BaseDialog } from "@/components/shared/base-dialog";
import { Plus } from "lucide-react";

export function AddPatientDialog() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile updated!");
  };

  return (
    <BaseDialog
      trigger={
        <Button variant="default" className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Patient
        </Button>
      }
      title="Edit profile"
      description="Make changes to your profile here. Click save when you're done."
      onSubmit={handleSubmit}
    >
      <div className="grid gap-3">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue="Pedro Duarte" />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" defaultValue="@peduarte" />
      </div>
    </BaseDialog>
  );
}
