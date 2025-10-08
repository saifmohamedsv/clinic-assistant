import Sidebar from "@/components/layout/sidebar";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider session={undefined}>
      <div className="flex h-screen bg-background space-x-2 p-4">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col rounded-lg overflow-hidden">
          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6 bg-card border">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
