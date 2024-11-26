"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./use-auth";

const LOGIN_ROUTE = "/auth/login";

const PUBLIC_ROUTES = [LOGIN_ROUTE, "/auth/register"];

export function useAuthGuard() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const isPublicRoute = PUBLIC_ROUTES.some((route) =>
        pathname.startsWith(route)
      );
      if (!isPublicRoute && !user) {
        router.push(LOGIN_ROUTE);
      } else if (isPublicRoute && user) {
        router.push("/dashboard");
      }
    }
  }, [user, loading, pathname, router]);

  return {
    isLoading: loading,
    isAuthenticated: !!user,
  };
}
