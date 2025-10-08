"use client";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Home, Users, Calendar, FileText, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { useTranslations } from "next-intl";
import Link from "next/link";

type NavItem = {
  icon: React.ElementType;
  label: "home" | "patients" | "appointments" | "records" | "settings";
  href: string;
};

const navItems: NavItem[] = [
  { icon: Home, label: "home", href: "/home" },
  { icon: Users, label: "patients", href: "/patients" },
  { icon: Calendar, label: "appointments", href: "/appointments" },
  { icon: FileText, label: "records", href: "/records" },
  { icon: Settings, label: "settings", href: "/settings" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const session = useSession();
  const t = useTranslations("sidebar");

  const user = session?.data?.user as User;

  const getInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <TooltipProvider>
      <div
        className={`h-full bg-card border rounded-lg shadow-lg flex flex-col py-4 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Toggle Button */}
        <div className="flex justify-end px-3 mb-4">
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Link href={{ pathname: item.href }}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={`justify-start h-12 rounded-lg ${isCollapsed ? "w-full px-0" : "w-full px-4"}`}
                      >
                        <item.icon className="h-5 w-5" />
                        {!isCollapsed && (
                          <span className="font-medium ms-3">{item.label === "home" ? t("home") : t(item.label)}</span>
                        )}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <p>{item.label === "home" ? t("home") : t(item.label)}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}

        {/* User Info */}
        {isCollapsed && (
          <div className="w-8 h-8 bg-primary m-auto rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground text-xs font-medium">{getInitials(user?.name as string)}</span>
          </div>
        )}

        {!isCollapsed && (
          <div className="px-3">
            <div className="bg-muted/50 rounded-lg p-3 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground text-xs font-medium">
                    {getInitials(user?.name as string)}
                  </span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground truncate">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.role}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="px-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => signOut({ redirect: true, callbackUrl: "/sign-in" })}
                variant="ghost"
                className={`justify-start h-12 rounded-lg ${isCollapsed ? "w-full px-0" : "w-full px-4"}`}
              >
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span className="font-medium ml-3">{t("logout")}</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>{t("logout")}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Sidebar;
