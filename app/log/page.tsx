import { DailyLogView } from "@/components/log/daily-log-view";
import { Header } from "@/components/header";

export default function LogPage() {
  return (
    <div className="space-y-6">
      <Header title="Daily activity log" />
      <DailyLogView />
    </div>
  );
}
