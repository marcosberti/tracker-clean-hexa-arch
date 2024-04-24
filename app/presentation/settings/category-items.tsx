import { Link, useAsyncValue } from "@remix-run/react";
import { Pencil } from "lucide-react";

import { CategorySelect } from "~/application/categories";
import { Card, DeleteButton } from "~/presentation/components";
import { CarouselItem } from "~/presentation/components/ui/carousel";

export function CategoryItems() {
  const categories = useAsyncValue() as CategorySelect[];

  return categories.map((c) => (
    <CarouselItem key={c.id} className="pl-4 basis-[275px]">
      <Card color={c.color}>
        <Card.Header asChild>
          <div className="flex justify-between items-center group">
            <p className="text-lg font-semibold">{c.name}</p>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition ease-out">
              <Link
                to={`/edit/category/${c.id}`}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground size-8 p-0"
              >
                <Pencil className="size-4" />
              </Link>
              <DeleteButton id={c.id} entity="category" />
            </div>
          </div>
        </Card.Header>
      </Card>
    </CarouselItem>
  ));
}
