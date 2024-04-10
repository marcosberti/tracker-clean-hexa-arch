import { Link, useLocation } from "@remix-run/react";
import { Banknote, BarChart2, Settings } from "lucide-react";

const ROUTES = [
  { path: "/", icon: BarChart2, title: "Dashboard" },
  // {
  //   path: "/accounts",
  //   icon: Banknote,
  //   title: "Accounts",
  // },
  {
    path: "/settings",
    icon: Settings,
    title: "settings",
  },
];

function Routes() {
  const location = useLocation();

  return (
    <div className="w-full flex flex-col gap-2 items-center">
      {ROUTES.map(({ path, title, icon: Icon }) => (
        <div
          key={path}
          data-active={
            path === location.pathname ||
            (location.pathname.startsWith(path) && path !== "/") ||
            undefined
          }
          className="data-[active]:bg-green-100 data-[active]:text-gray-800 group rounded-lg relative w-[50px] h-[50px] text-gray-500 transition-all duration-300 hover:text-green-700"
        >
          <Link
            title={title}
            to={path}
            className="flex w-full h-full items-center justify-center py-3"
          >
            <Icon className="group-active:translate-y-[1px]" />
          </Link>
        </div>
      ))}
    </div>
  );
}

function Logo() {
  return (
    <div className="w-full flex justify-center">
      <Link to="/">
        <div className="relative h-10 w-10 lg:h-16 lg:w-16 rounded-2xl bg-gradient-to-br from-green-300">
          <div className="absolute top-[50%] left-[50%] -translate-x-[55%] -translate-y-[55%] select-none text-3xl lg:text-5xl font-bold text-gray-700">
            <span>t</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="basis-[100px] min-h-screen py-10 px-8 flex flex-col items-center">
      <Logo />
      <div className="w-[35%] h-[4px] bg-gray-400 my-8 rounded-lg" />
      <Routes />
      <div className="mt-auto">user</div>
    </nav>
  );
}
