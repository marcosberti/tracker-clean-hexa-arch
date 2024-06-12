import { Link, useAsyncValue } from "@remix-run/react";
import { Pencil, Trash2 } from "lucide-react";

import { CurrencySelect } from "~/application/currencies";
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

export function Currencies() {
  const currencies = useAsyncValue() as CurrencySelect[];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Code</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {currencies.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="w-[50%]">{c.name}</TableCell>
            <TableCell className="w-[50%]">{c.code}</TableCell>
            <TableCell>
              <div className="flex gap-2 items-center">
                <Button variant="ghost" asChild>
                  <Link to={`edit/currency/${c.id}`}>
                    <Pencil className="size-4" />
                  </Link>
                </Button>
                <DeleteButton id={c.id} entity="currency">
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
