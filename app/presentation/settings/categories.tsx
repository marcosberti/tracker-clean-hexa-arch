import { Link, useAsyncValue } from "@remix-run/react";
import { Pencil, Trash2 } from "lucide-react";

import { CategorySelect } from "~/application/categories";
import { DeleteButton } from "~/presentation/components";
import { Button } from "~/presentation/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/presentation/components/ui/table";

import { TAILWIND_BG } from "../utils";

export function Categories() {
  const categories = useAsyncValue() as CategorySelect[];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Icon</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="w-[50%]">{c.name}</TableCell>
            <TableCell className="w-[50%]">
              <span
                className={`mr-2 inline-block h-2 w-2 rounded-full ${
                  TAILWIND_BG[c.color as keyof typeof TAILWIND_BG]
                }`}
              />
              {c.icon}
            </TableCell>
            <TableCell>
              <div className="flex gap-2 items-center">
                <Button variant="ghost" asChild>
                  <Link to={`edit/category/${c.id}`}>
                    <Pencil className="size-4" />
                  </Link>
                </Button>
                <DeleteButton id={c.id} entity="category">
                  <Button variant="ghost">
                    <Trash2 className="size-4 text-red-700" />
                  </Button>
                </DeleteButton>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
