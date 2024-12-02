// components/tasks/recurring-tasks-view.tsx
"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { RecurringTasks } from "@/components/tasks/recurring-tasks"
import { Task } from "@/lib/types"
import { useRecurringTasks } from "@/lib/hooks/use-recurring-tasks"
import { useAuth } from "@/lib/hooks/use-auth"
import { toast } from "sonner"

export interface RecurringTask extends Task {
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly'
    weekDay?: number
    monthDay?: number
  }
}

export function RecurringTasksView() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { tasks, loading, addTask, updateTask, deleteTask } = useRecurringTasks()
  const { user } = useAuth()

  const formattedTasks: RecurringTask[] = tasks.map(task => ({
    id: task.id,
    user_id: task.user_id,
    content: task.title,
    completed: false,
    completed_at: null,
    time: task.time,
    client_tag_id: task.client_id,
    project_tag_id: task.project_id,
    created_at: task.created_at,
    task_client_tags: task.clients ? {
      task_id: task.id,
      id: task.clients.id,
      name: task.clients.name,
      emoji: task.clients.emoji,
      color: task.clients.emoji, // Using emoji as color since color isn't available
      tag: `client:${task.clients.name}`
    } : null,
    task_project_tags: task.projects ? {
      task_id: task.id,
      id: task.projects.id,
      name: task.projects.name,
      client_name: task.clients?.name || '',
      tag: `project:${task.clients?.name || ''}/${task.projects.name}`
    } : null,
    schedule: {
      frequency: task.frequency,
      weekDay: task.week_day || undefined,
      monthDay: task.month_day || undefined
    }
  }))

  const handleAddTask = async (task: Partial<RecurringTask>) => {
    try {
      if (!user) {
        toast.error("Please sign in to create tasks")
        return
      }

      if (!task.content || !task.schedule?.frequency) {
        toast.error("Task title and frequency are required")
        return
      }

      await addTask(
        task.content,
        task.schedule.frequency,
        {
          time: task.time || undefined,
          client_id: task.client_tag_id || undefined,
          project_id: task.project_tag_id || undefined,
          weekDay: task.schedule.weekDay,
          monthDay: task.schedule.monthDay
        }
      )
      setShowCreateDialog(false)
      toast.success("Task created successfully")
    } catch (error) {
      console.error("Error creating task:", error)
      toast.error("Failed to create task")
    }
  }

  const handleUpdateTask = async (id: string, updates: Partial<RecurringTask>) => {
    try {
      if (!user) {
        toast.error("Please sign in to update tasks")
        return
      }

      await updateTask(id, {
        title: updates.content,
        time: updates.time || null,
        client_id: updates.client_tag_id || null,
        project_id: updates.project_tag_id || null,
        frequency: updates.schedule?.frequency,
        week_day: updates.schedule?.weekDay || null,
        month_day: updates.schedule?.monthDay || null
      })
      toast.success("Task updated successfully")
    } catch (error) {
      console.error("Error updating task:", error)
      toast.error("Failed to update task")
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      if (!user) {
        toast.error("Please sign in to delete tasks")
        return
      }

      await deleteTask(id)
      toast.success("Task deleted successfully")
    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error("Failed to delete task")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please sign in to manage your recurring tasks</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Recurring Tasks</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <RecurringTasks
        tasks={formattedTasks}
        onDelete={handleDeleteTask}
        onUpdate={handleUpdateTask}
      />

      <CreateTaskDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleAddTask}
        type="recurring"
      />
    </Card>
  )
}
