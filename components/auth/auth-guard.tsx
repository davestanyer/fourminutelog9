"use client";

import { useAuthGuard } from "@/lib/hooks/use-auth-guard";
import { ReactNode } from "react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoading } = useAuthGuard();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
