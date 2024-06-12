import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  defer,
  json,
} from "@remix-run/node";
import {
  Await,
  Link,
  Outlet,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import { PlusCircle } from "lucide-react";
import { Suspense } from "react";
import invariant from "tiny-invariant";

import { getCategories, deleteCategory } from "~/application/categories";
import { deleteCurrency, getCurrencies } from "~/application/currencies";
import { requireUserId } from "~/application/session";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/presentation/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/presentation/components/ui/tabs";
import { useActionToast } from "~/presentation/hooks";

import { Button } from "../components/ui/button";

import { Categories } from "./categories";
import { Currencies } from "./currencies";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const intent = formData.get("intent") as string;
  const [action, entity] = intent.split("-");

  let errors;
  let message;

  if (action === "delete" && entity === "currency") {
    const currency = formData.get("currency");

    invariant(typeof currency === "string", "missing currency");
    const result = await deleteCurrency(userId, currency);
    errors = result.errors;
    message = !errors ? "Currency deleted" : null;
  }

  if (action === "delete" && entity === "category") {
    const category = formData.get("category");

    invariant(typeof category === "string", "missing category");
    const result = await deleteCategory(userId, category);
    errors = result.errors;
    message = !errors ? "Category deleted" : null;
  }

  return json({ intent, message, errors }, { status: errors ? 400 : 200 });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const currencies = getCurrencies(userId);
  const categories = getCategories(userId);

  return defer({ currencies, categories });
}

export default function Settings() {
  const { currencies, categories } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  useActionToast(actionData);

  // return (
  //   <>
  //     <div className="flex flex-col gap-4">
  //       <Await resolve={currencies}>
  //         <EntityCarousel
  //           title="Currencies"
  //           createRoute="/create/currency"
  //           items={CurrencyItems}
  //         />
  //       </Await>
  //       <Await resolve={categories}>
  //         <EntityCarousel
  //           title="Categories"
  //           createRoute="/create/category"
  //           items={CategoryItems}
  //         />
  //       </Await>
  //     </div>
  //   </>
  // );

  return (
    <main className="p-4 sm:p-6 grid gap-4 mt-8 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <div className="xl:col-span-2">
        <Tabs defaultValue="currencies">
          <TabsList>
            <TabsTrigger value="currencies">Currencies</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          <TabsContent value="currencies">
            <Card className="bg-background">
              <CardHeader className="px-7">
                <div className="flex items-center justify-between">
                  <CardTitle>Currencies</CardTitle>
                  <Button asChild>
                    <Link to="create/currency">
                      <PlusCircle className="size-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Suspense fallback={null}>
                  <Await resolve={currencies}>
                    <Currencies />
                  </Await>
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="categories">
            <Card className="bg-background">
              <CardHeader className="px-7">
                <div className="flex items-center justify-between">
                  <CardTitle>Categories</CardTitle>
                  <Button asChild>
                    <Link to="create/category">
                      <PlusCircle className="size-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Suspense fallback={null}>
                  <Await resolve={categories}>
                    <Categories />
                  </Await>
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div>
        <Outlet />
      </div>
    </main>
  );
}
