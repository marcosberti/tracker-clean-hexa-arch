import { Form } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { CategorySelectById } from "~/application/categories";
import { ErrorMessage, IconsCombobox } from "~/presentation/components";
import { Button } from "~/presentation/components/ui/button";
import { Input } from "~/presentation/components/ui/input";
import { Label } from "~/presentation/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/presentation/components/ui/select";
import { COLORS, TAILWIND_BG } from "~/presentation/utils";

interface CategoryFormArgs {
  category?: CategorySelectById;
  errors:
    | {
        name?: [string];
        icon?: [string];
        color?: [string];
      }
    | undefined;
}

export default function CategoryForm({ category, errors }: CategoryFormArgs) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!category) {
      return;
    }

    formRef.current?.reset();
  }, [category]);

  return (
    <Form method="post" className="w-full" noValidate ref={formRef}>
      <div className="w-full">
        <Label htmlFor="name">Name</Label>
        <div className="mt-1 w-full">
          <Input
            id="name"
            name="name"
            defaultValue={category?.name}
            aria-invalid={errors?.name ? true : undefined}
            aria-describedby="name-error"
          />
          <ErrorMessage message={errors?.name} />
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="basis-[50%]">
          <Label htmlFor="icon">Icon</Label>
          <IconsCombobox
            name="icon"
            defaultIcon={category?.icon}
            aria-invalid={errors?.icon ? true : undefined}
            aria-describedby="icon-error"
          />
          <ErrorMessage message={errors?.icon} />
        </div>
        <div className="basis-[50%]">
          <Label htmlFor="color">Color</Label>
          <Select name="color" defaultValue={category?.color}>
            <SelectTrigger
              aria-invalid={errors?.color ? true : undefined}
              aria-describedby="color-error"
            >
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              {COLORS.map((color) => (
                <SelectItem key={color} value={color}>
                  <span
                    className={`mr-2 inline-block h-2 w-2 rounded-full ${TAILWIND_BG[color]} `}
                  />
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorMessage message={errors?.color} />
        </div>
      </div>
      <div className="mt-6">
        <Button type="submit" className="w-full">
          Save
        </Button>
      </div>
    </Form>
  );
}
