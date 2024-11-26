"use client";

import { useAuthGuard } from "@/lib/hooks/use-auth-guard";
import { ReactNode } from "react";
import MainLayout from "../main-layout";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuthGuard();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return children;
  }

  return <MainLayout>{children}</MainLayout>;
}
