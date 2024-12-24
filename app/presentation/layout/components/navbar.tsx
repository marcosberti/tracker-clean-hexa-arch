import { Link, useLocation } from "@remix-run/react";
import { Home, Settings, Wallet } from "lucide-react";

import Logo from "~/presentation/components/logo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/presentation/components/ui/tooltip";
import { cn } from "~/presentation/utils";

export default function Navbar() {
  const location = useLocation();

  const isHomeActive = "/" === location.pathname;
  const isAccountsActive = location.pathname.startsWith("/account");
  const isSettingsActive = "/settings" === location.pathname;

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden flex-col border-r sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-4 lg:px-3">
        <Link
          to="/"
          className="group relative flex h-10 w-10 rounded-lg lg:h-14 lg:w-14 lg:rounded-2xl shrink-0 items-center justify-center gap-2 bg-gradient-to-br from-green-300 to-neutral-100 text-lg font-semibold text-primary-foreground sm:h-8 sm:w-8 sm:text-base"
        >
          <Logo />
        </Link>
        <div className="w-[35%] h-[4px] bg-gray-400 my-8 rounded-lg" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground sm:h-8 sm:w-8",
                isHomeActive && "bg-accent text-accent-foreground",
              )}
            >
              <Home className="h-5 w-5" />
              <span className="sr-only">Dashboard</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Dashboard</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/accounts"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground sm:h-8 sm:w-8",
                isAccountsActive && "bg-accent text-accent-foreground",
              )}
            >
              <Wallet className="h-5 w-5" />
              <span className="sr-only">Accounts</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Accounts</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/settings"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground sm:h-8 sm:w-8",
                isSettingsActive && "bg-accent text-accent-foreground",
              )}
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}
