export type BreadcrumbLabel = string | ((data: Record<string, unknown>, params: Record<string, string>) => string) | null;

export interface AppRouteData {
  breadcrumb?: BreadcrumbLabel;
}

export interface Breadcrumb {
  label: string;
  url: string;
}
