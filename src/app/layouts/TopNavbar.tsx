import { PanelLeftClose, PanelLeft, User } from "lucide-react";
import { useLayoutStore } from "@/app/store/layoutStore";
import { MobileDrawer } from "./MobileDrawer";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { ThemeToggle } from "@/shared/components/ThemeToggle";

export function TopNavbar() {
  const { isSidebarCollapsed, toggleSidebar } = useLayoutStore();

  return (
    <header className="supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex w-full shrink-0 items-center justify-between border-b bg-background/95 px-4 h-16 backdrop-blur md:px-6">
      <div className="flex items-center gap-4">
        <MobileDrawer />

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden text-muted-foreground hover:text-foreground md:flex"
        >
          {isSidebarCollapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="User" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 border border-border bg-card shadow-xl ring-1 ring-border/60 backdrop-blur-none"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Test User</p>
                <p className="text-xs leading-none text-muted-foreground">
                  user@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
