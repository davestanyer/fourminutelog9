"use client"

import { Task } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface OneOffTasksProps {
  tasks: Task[]
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Task>) => void
}

export function OneOffTasks({ tasks, onDelete, onUpdate }: OneOffTasksProps) {
  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-center text-muted-foreground">No one-off tasks yet</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="space-y-1">
              <div className="font-medium">{task.content}</div>
              <div className="text-sm text-muted-foreground">
                {task.completed_at && `Completed ${format(new Date(task.completed_at), "PPP")}`}
                {task.time && ` at ${task.time}`}
              </div>
              <div className="flex gap-2">
                {task.task_client_tags && (
                  <Badge variant="secondary">
                    {task.task_client_tags.emoji} {task.task_client_tags.name}
                  </Badge>
                )}
                {task.task_project_tags && (
                  <Badge variant="outline">
                    {task.task_project_tags.name}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  // TODO: Implement edit functionality
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
