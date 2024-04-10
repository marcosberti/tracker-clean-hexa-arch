import { AccountSelect } from "~/application/accounts";
import { Icon } from "~/presentation/components";
import { COLORS, cn, formatAmount, formatDate } from "~/presentation/utils";

// const PROPERTIES = ["from-color-300"];
// const FROM_COLORS = COLORS.reduce(
//   (acc, color) => {
//     acc[color] = PROPERTIES[0].replace("color", color);

//     return acc;
//   },
//   {} as { [K in (typeof COLORS)[number]]: string },
// );

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

export default function AccountCard({ account }: { account: AccountSelect }) {
  return (
    <div
      key={account.id}
      className={cn(
        // "min-w-[275px] basis-[275px] h-[130px] p-4 shadow-md rounded-lg bg-opacity-30 flex flex-col justify-between bg-gradient-to-br",
        "h-[130px] p-4 shadow-md rounded-lg bg-opacity-30 flex flex-col justify-between bg-gradient-to-br",
        `${FROM_COLORS[account.color as keyof typeof FROM_COLORS]}`,
      )}
    >
      <p className="text-lg font-semibold">
        {formatAmount(Number(account.balance), account.currency.code)}
      </p>
      <div>
        <div className="flex gap-2 items-center">
          <Icon icon={account.icon} className="size-6" />
          <p className="font-semibold ">{account.name}</p>
        </div>
        <p className="text-xs">
          Latest transaction:{" "}
          {account.updatedAt && account.createdAt !== account.updatedAt
            ? formatDate(account.updatedAt)
            : "-"}
        </p>
      </div>
    </div>
  );
}
