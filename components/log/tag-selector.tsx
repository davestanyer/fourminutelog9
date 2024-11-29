import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useClients } from "@/lib/hooks/use-clients";
import { Loading } from "../loading";

interface TagSelectorProps {
  onSelect: (clientId: string | null, projectId: string | null) => void;
}

export function TagSelector({ onSelect }: TagSelectorProps) {
  const { clients, loading } = useClients();

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {clients.map((client) => (
          <div key={client.id} className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => onSelect(client.id, null)}
            >
              <span className="text-lg">{client.emoji}</span>
              <span>{client.name}</span>
            </Button>

            {client.projects && client.projects.length > 0 && (
              <div className="pl-4 space-y-1">
                {client.projects.map((project) => (
                  <Button
                    key={project.id}
                    variant="ghost"
                    className="w-full justify-start text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => onSelect(client.id, project.id)}
                  >
                    {project.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
        {clients.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No clients found. Add clients in the Clients section.
          </p>
        )}
      </div>
    </ScrollArea>
  );
}
