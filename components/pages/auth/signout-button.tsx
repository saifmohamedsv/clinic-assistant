import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export const SignOutButton = () => {
  return (
    <Button type="submit" onClick={() => signOut()}>
      Sign Out
    </Button>
  );
};
