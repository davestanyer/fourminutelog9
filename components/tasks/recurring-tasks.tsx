// components/tasks/recurring-tasks.tsx
"use client"

import { Task } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Clock, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EditRecurringTaskDialog } from "./edit-recurring-task-dialog"
import { useState } from "react"
import { RecurringTask } from "./recurring-tasks-view"

interface RecurringTasksProps {
  tasks: RecurringTask[]
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<RecurringTask>) => void
}

export function RecurringTasks({ tasks, onDelete, onUpdate }: RecurringTasksProps) {
  const [editingTask, setEditingTask] = useState<RecurringTask | null>(null)

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
              <div className="font-medium">{task.content}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span>
                  {task.schedule?.frequency}
                  {task.schedule?.frequency === "weekly" && 
                    ` (${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][task.schedule.weekDay || 0]})`}
                  {task.schedule?.frequency === "monthly" && 
                    ` (Day ${task.schedule.monthDay})`}
                </span>
                {task.time && (
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {task.time}
                  </Badge>
                )}
              </div>
              {(task.task_client_tags || task.task_project_tags) && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="gap-1">
                    <Briefcase className="h-3 w-3" />
                    {task.task_client_tags?.emoji && 
                      <span>{task.task_client_tags.emoji}</span>}
                    {task.task_client_tags?.name}
                    {task.task_project_tags && 
                      ` / ${task.task_project_tags.name}`}
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingTask(task)}
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
