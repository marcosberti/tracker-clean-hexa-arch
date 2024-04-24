import { Fragment } from "react/jsx-runtime";

import {
  Breadcrumb as ShadBreadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/presentation/components/ui/breadcrumb";

interface BreadcrumbArgs {
  items: (
    | {
        label: string;
        link: string;
      }
    | {
        label: string;
        link?: undefined;
      }
  )[];
}

export function Breadcrumb({ items }: BreadcrumbArgs) {
  return (
    <ShadBreadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.label}>
            <BreadcrumbItem>
              {"link" in item ? (
                <BreadcrumbLink href={item.link}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {items.length - 1 > index ? <BreadcrumbSeparator /> : null}
          </Fragment>
        ))}
      </BreadcrumbList>
    </ShadBreadcrumb>
  );
}
