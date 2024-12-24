import { cn } from "~/presentation/utils";

interface ErrorMessageArgs {
  message: string | [string] | undefined;
}

export function ErrorMessage({ message }: ErrorMessageArgs) {
  return (
    <div
      id="title-error"
      className={cn("mt-1 invisible ", message && "visible")}
    >
      <p className="text-destructive text-xs">{message}</p>
    </div>
  );
}
