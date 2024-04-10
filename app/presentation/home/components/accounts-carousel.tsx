import { Link } from "@remix-run/react";
import { Plus } from "lucide-react";

import { AccountSelect } from "~/application/accounts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/presentation/components/ui/carousel";

import AccountCard from "./account-card";

interface AccountsCarouselArgs {
  accounts: AccountSelect[];
}

export default function AccountsCarousel({ accounts }: AccountsCarouselArgs) {
  return (
    <Carousel className="w-full max-w-[calc(100vw-275px-128px-6rem)]">
      <CarouselContent className="h-[136px] -ml-4">
        {accounts.map((account) => (
          <CarouselItem key={account.id} className="pl-4 basis-[275px]">
            <AccountCard account={account} />
          </CarouselItem>
        ))}
        <CarouselItem className="min-w-[130px] basis-[130px] h-[130px] pl-4">
          <Link
            to="/create-account"
            className="w-full h-full p-4 flex justify-center items-center shadow-md rounded-lg opacity-50 hover:opacity-100 transition-opacity ease-out active:translate-y-[1px]"
          >
            <Plus className="size-8" />
          </Link>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="-left-4 disabled:opacity-0" />
      <CarouselNext className="-right-4 disabled:opacity-0" />
    </Carousel>
  );
}
