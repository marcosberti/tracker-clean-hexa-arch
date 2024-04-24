import { cn } from "../utils";

const FROM_COLORS = {
  amber: "from-amber-300",
  blue: "from-blue-300",
  cyan: "from-cyan-300",
  emerald: "from-emerald-300",
  fuchsia: "from-fuchsia-300",
  gray: "from-gray-300",
  green: "from-green-300",
  indigo: "from-indigo-300",
  lightBlue: "from-lightBlue-300",
  lime: "from-lime-300",
  neutral: "from-neutral-300",
  orange: "from-orange-300",
  pink: "from-pink-300",
  purple: "from-purple-300",
  red: "from-red-300",
  rose: "from-rose-300",
  sky: "from-sky-300",
  slate: "from-slate-300",
  stone: "from-stone-300",
  teal: "from-teal-300",
  violet: "from-violet-300",
  yellow: "from-yellow-300",
  zinc: "from-zinc-300",
};

interface HeaderArgs {
  asChild?: boolean;
  children: string | JSX.Element | JSX.Element[];
}

function Header({ asChild, children }: HeaderArgs) {
  if (asChild) {
    return children;
  }

  return <p className="text-lg font-semibold">{children}</p>;
}

interface BodyArgs {
  children: JSX.Element | JSX.Element[];
}

function Body({ children }: BodyArgs) {
  return <div>{children}</div>;
}

interface CardArgs {
  color: string;
  className?: string;
  children: JSX.Element | JSX.Element[];
}

export function Card({ color, className, children }: CardArgs) {
  return (
    <div
      className={cn(
        "h-[130px] p-4 shadow-md rounded-lg bg-opacity-30 flex flex-col justify-between bg-gradient-to-br",
        className,
        `${FROM_COLORS[color as keyof typeof FROM_COLORS]}`,
      )}
    >
      {children}
    </div>
  );
}

Card.Header = Header;
Card.Body = Body;
