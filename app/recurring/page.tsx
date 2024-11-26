"use client";

import { RecurringTasksView } from "@/components/tasks/recurring-tasks-view";
import { Header } from "@/components/header";

export default function RecurringPage() {
  return (
    <div>
      <Header title="Recurring tasks" />
      <RecurringTasksView />
    </div>
  );
}
