import { Form } from "@remix-run/react";
import { Trash2 } from "lucide-react";

import { Button } from "~/presentation/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/presentation/components/ui/dialog";

interface DeleteButtonArgs {
  id: string;
  entity: "account" | "currency" | "category" | "transaction";
}

export function DeleteButton({ id, entity }: DeleteButtonArgs) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-0 h-auto flex gap-2 size-8">
          <Trash2 className="size-4 text-red-700" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            {entity} and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Form method="post">
              <input hidden name={entity} defaultValue={id} />
              <Button
                type="submit"
                name="intent"
                value={`delete-${entity}`}
                variant="default"
              >
                Confirm
              </Button>
            </Form>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
