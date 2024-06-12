import { Link, useLocation } from "@remix-run/react";
import {
  Home,
  PanelLeft,
  PlusCircle,
  Settings,
  UserCircle,
  Wallet,
} from "lucide-react";

import { AccountByIdSelect } from "~/application/accounts";
import Logo from "~/presentation/components/logo";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/presentation/components/ui/breadcrumb";
import { Button } from "~/presentation/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/presentation/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "~/presentation/components/ui/sheet";
import { cn } from "~/presentation/utils";

interface HeaderArgs {
  account: AccountByIdSelect | undefined;
}

function HomeHeader() {
  return <h1 className="font-bold text-3xl">Dashboard</h1>;
}

function AccountsHeader() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Accounts</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function AccountDetailHeader({ account }: HeaderArgs) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/accounts">Accounts</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{account!.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function SettingsHeader() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Settings</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function AccountsActionsHeader() {
  return (
    <Button asChild>
      <Link to="/accounts/create">
        <PlusCircle className="size-4 mr-2" /> Create account
      </Link>
    </Button>
  );
}

function AccountDetailActionsHeader({ account }: HeaderArgs) {
  return (
    <Button asChild>
      <Link to={`/account/${account!.id}/create/expense`}>
        <PlusCircle className="size-4 mr-2" /> Create expense
      </Link>
    </Button>
  );
}

type SectionHeaderT =
  | (() => JSX.Element)
  | ((props: HeaderArgs) => JSX.Element);

type HaederActionsCompT =
  | (() => null)
  | (() => JSX.Element)
  | ((props: HeaderArgs) => JSX.Element);

export default function Header({ account }: HeaderArgs) {
  const location = useLocation();

  const isHomeActive = location.pathname === "/";
  const isAccountsActive = location.pathname.startsWith("/accounts");
  const isAccountDetailActive = location.pathname.startsWith("/account/");
  const isSettingsActive = location.pathname === "/settings";

  let SectionHeader: SectionHeaderT = HomeHeader;
  if (isAccountsActive) {
    SectionHeader = AccountsHeader;
  } else if (isAccountDetailActive) {
    SectionHeader = AccountDetailHeader;
  } else if (isSettingsActive) {
    SectionHeader = SettingsHeader;
  }

  let HeaderActionsComp: HaederActionsCompT = () => null;
  if (isAccountsActive) {
    HeaderActionsComp = AccountsActionsHeader;
  } else if (isAccountDetailActive) {
    HeaderActionsComp = AccountDetailActionsHeader;
  }

  return (
    <header className="sticky top-0 z-30 pt-4 flex h-[4.5rem] items-center gap-4 border-b bg-background px-4 sm:static sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              to="/"
              className="group relative flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-foreground text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Logo />
            </Link>
            <Link
              to="/"
              className={cn(
                "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                isHomeActive && "text-foreground",
              )}
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              to="/settings"
              className={cn(
                "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                isAccountsActive && "text-foreground",
              )}
            >
              <Wallet className="h-5 w-5" />
              Accounts
            </Link>
            <Link
              to="/settings"
              className={cn(
                "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                isSettingsActive && "text-foreground",
              )}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      <SectionHeader account={account} />

      <div className="ml-auto flex items-center gap-4">
        <HeaderActionsComp account={account} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full bg-white"
            >
              <UserCircle className="size-6 text-primary-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
