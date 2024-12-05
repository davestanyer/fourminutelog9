"use client"

import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Clock, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EditRecurringTaskDialog } from "./edit-recurring-task-dialog"
import { useState } from "react"
import { RecurringTask, RecurringTaskUpdate } from "@/lib/types/recurring-tasks"
import { getFrequencyDisplay } from "@/lib/utils/recurring-tasks"

interface RecurringTasksProps {
  tasks: RecurringTask[]
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: RecurringTaskUpdate) => void
}

export function RecurringTasks({
  tasks,
  onDelete,
  onUpdate
}: RecurringTasksProps) {
  const [editingTask, setEditingTask] = useState<RecurringTask | null>(null)

  // Ensure task has required properties before opening edit dialog
  const handleEditTask = (task: RecurringTask) => {
    // Create a normalized version of the task with guaranteed non-undefined properties
    const normalizedTask: RecurringTask = {
      ...task,
      client_name: task.client_name ?? null,
      client_emoji: task.client_emoji ?? null,
      project_name: task.project_name ?? null
    }
    setEditingTask(normalizedTask)
  }

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-center text-muted-foreground">No recurring tasks yet</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="space-y-1 flex-1">
              <div className="font-medium">{task.title}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span>{getFrequencyDisplay(task)}</span>
                {task.time && (
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {task.time}
                  </Badge>
                )}
              </div>
              {(task.client_name || task.project_name) && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="gap-1">
                    <Briefcase className="h-3 w-3" />
                    {task.client_emoji && 
                      <span>{task.client_emoji}</span>}
                    {task.client_name}
                    {task.project_name && 
                      ` / ${task.project_name}`}
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditTask(task)}
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

      {editingTask && (
        <EditRecurringTaskDialog
          task={editingTask}
          open={!!editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
          onSubmit={(updates) => {
            onUpdate(editingTask.id, updates)
            setEditingTask(null)
          }}
        />
      )}
    </div>
  )
}
