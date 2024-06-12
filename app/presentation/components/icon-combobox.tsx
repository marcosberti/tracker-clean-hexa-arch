import { icons as LucideIcons, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { cn } from "../utils";

import { Icon } from "./icon";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface IconsComboboxArgs {
  name: string;
  defaultIcon?: string;
  "aria-invalid": boolean | undefined;
}

export function IconsCombobox({
  name,
  defaultIcon,
  ["aria-invalid"]: ariaInvalid,
}: IconsComboboxArgs) {
  const [open, setOpen] = React.useState(false);
  const [term, setTerm] = React.useState("");
  const [icon, setIcon] = React.useState(defaultIcon);

  const allIcons = Object.keys(LucideIcons) as (keyof typeof LucideIcons)[];
  let icons = allIcons;

  if (term) {
    icons = icons.filter((icon) => icon.toLocaleLowerCase().includes(term));
  } else {
    icons = icons.slice(0, 50);
  }

  const handleOpenChange = (state: boolean) => {
    setTerm("");
    setOpen(state);
  };

  return (
    <>
      <input name={name} value={icon} type="hidden" />
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "justify-between w-full",
              ariaInvalid && "border-destructive text-destructive",
            )}
          >
            {icon ? allIcons.find((i) => i === icon) : "Select an icon..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput
              placeholder="Search an icon..."
              onValueChange={(value) => setTerm(value)}
            />
            <CommandList>
              <CommandEmpty>No icons found.</CommandEmpty>
              <CommandGroup className="h-[250px] overflow-y-scroll">
                <CommandItem>Profile</CommandItem>
                {icons.map((icon) => (
                  <CommandItem
                    key={icon}
                    value={icon}
                    className="text-gray-600 flex gap-2"
                    onSelect={() => {
                      setTerm("");
                      setIcon(icon);
                      setOpen(false);
                    }}
                  >
                    <Icon icon={icon} className="h-4 w-4" />
                    {icon}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
