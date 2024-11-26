"use client";

import { TeamView } from "@/components/team/team-view";
import { Header } from "@/components/header";

export default function TeamPage() {
  return (
    <div>
      <Header title="Team" />
      <TeamView />
    </div>
  );
}
