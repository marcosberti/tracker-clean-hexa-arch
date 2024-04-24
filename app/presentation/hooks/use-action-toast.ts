import { useEffect } from "react";

import { useToast } from "../components/ui/use-toast";

interface ActionToastArgs {
  intent: string;
  message?: string | null;
  errors?: string | null;
}

export function useActionToast(data: ActionToastArgs | undefined) {
  const { toast } = useToast();

  useEffect(() => {
    if (!data) return;

    const { intent, message, errors } = data;

    if (intent.startsWith("delete")) {
      toast({
        title: errors ? "Oops! Something went wrong." : undefined,
        description: errors ?? message,
        variant: errors ? "destructive" : "success",
      });
    }
  }, [data, toast]);

  return null;
}
