import { ClientList } from "@/components/clients/client-list";
import { Header } from "@/components/header";

export default function ClientsPage() {
  return (
    <div className="space-y-8">
      <Header title="Client management" />
      <ClientList />
    </div>
  );
}
