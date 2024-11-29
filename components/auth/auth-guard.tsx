"use client";

import { useAuthGuard } from "@/lib/hooks/use-auth-guard";
import { ReactNode } from "react";
import MainLayout from "../main-layout";
import { Loading } from "../loading";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuthGuard();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!isAuthenticated) {
    return children;
  }

  return <MainLayout>{children}</MainLayout>;
}
