import { Link } from "@remix-run/react";
import { Plus } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/presentation/components/ui/carousel";

interface EntityCarouselArgs {
  title: string;
  items: React.ComponentType;
  createRoute: string;
}

export function EntityCarousel({
  title,
  items: Items,
  createRoute,
}: EntityCarouselArgs) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <Carousel className="w-full max-w-[calc(100vw-275px-128px-6rem)]">
        <CarouselContent className="h-[136px] -ml-4">
          <Items />
          <CarouselItem className="min-w-[130px] basis-[130px] h-[130px] pl-4">
            <Link
              to={createRoute}
              className="w-full h-full p-4 flex justify-center items-center shadow-md rounded-lg opacity-50 hover:opacity-100 transition-opacity ease-out active:translate-y-[1px]"
            >
              <Plus className="size-8" />
            </Link>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="-left-4 disabled:opacity-0" />
        <CarouselNext className="-right-4 disabled:opacity-0" />
      </Carousel>
    </div>
  );
}
