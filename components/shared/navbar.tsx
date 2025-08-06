import { TooltipProvider } from "@/components/ui/tooltip";
import { Search } from "lucide-react";
import { auth } from "@/lib/auth";

const Navbar = async () => {
  const session = await auth();

  console.log(session);

  return (
    <TooltipProvider>
      <div className="h-16 bg-background flex items-center justify-between px-6 shadow-sm border-b border-border">
        {/* Left side - Search Bar */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search patients, appointments, records..."
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Right side - User Menu and Actions */}
        {/* <div className="flex items-center gap-3 ml-6">
          <SignOut />
        </div> */}
      </div>
    </TooltipProvider>
  );
};

export default Navbar;
