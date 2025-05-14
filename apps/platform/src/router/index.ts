import { useLocation, useRoute } from "wouter";

export { useLocation, useRoute };
export { Link, Route, Switch } from "wouter";

export const ROUTES = {
  HOME: "/",
  CTA: "/cta",
  PHOTOMENUUPLOAD: "/photomenu",
} as const;

export type RouteParams = Record<string, string>;

export function useNavigation() {
  const [, setLocation] = useLocation();

  return {
    navigate: (to: string) => setLocation(to),
    navigateToHome: () => setLocation(ROUTES.HOME),
    navigateToPHOTOMENUUPLOAD: () => setLocation(ROUTES.PHOTOMENUUPLOAD),
  };
}
