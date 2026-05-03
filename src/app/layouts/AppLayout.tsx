import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

export function AppLayout() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground transition-colors duration-300 md:flex-row">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-muted/20 pb-10">
          <div className="container mx-auto h-full p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
