import { Link, useAsyncValue } from "@remix-run/react";
import clsx from "clsx";
import { Plus } from "lucide-react";

import { CategorySelect } from "~/application/categories";
import { Icon } from "~/presentation/components";
import { DeleteButton } from "~/presentation/components/delete-button";
import { TAILWIND_BG, TAILWIND_TEXT } from "~/presentation/utils";

export default function Categories() {
  const categories = useAsyncValue() as CategorySelect[];

  return (
    <>
      <div className="p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center h-9">
          <h2 className="font-semibold text-lg">Categories</h2>
          <Link
            to="/create/category"
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
          >
            <Plus className="size-4" />
          </Link>
        </div>
        <div className="w-full">
          <div className="mt-8">
            <CategoryList categories={categories} />
          </div>
        </div>
      </div>
    </>
  );
}

interface CategoryListArgs {
  categories: CategorySelect[];
}

function CategoryList({ categories }: CategoryListArgs) {
  return categories.length ? (
    <ol className="w-full flex flex-col gap-2">
      {categories.map((c) => (
        <li key={c.id}>
          <div
            className={clsx(
              "flex justify-between items-center px-4 py-2 rounded bg-opacity-20",
              TAILWIND_BG[c.color as keyof typeof TAILWIND_BG],
            )}
          >
            <div className="flex items-center gap-2">
              <Icon
                icon={c.icon}
                className={clsx(
                  "size-4",
                  TAILWIND_TEXT[c.color as keyof typeof TAILWIND_TEXT],
                )}
              />
              <span
                className={clsx(
                  TAILWIND_TEXT[c.color as keyof typeof TAILWIND_TEXT],
                )}
              >
                {c.name}
              </span>
            </div>
            <div>
              <DeleteButton id={c.id} entity="category" />
            </div>
          </div>
        </li>
      ))}
    </ol>
  ) : (
    <p className="text-center text-sm">no categories yey</p>
  );
}
