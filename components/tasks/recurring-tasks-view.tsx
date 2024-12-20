"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { RecurringTasks } from "@/components/tasks/recurring-tasks"
import { useRecurringTasks } from "@/lib/hooks/use-recurring-tasks"
import { useAuth } from "@/lib/hooks/use-auth"
import { toast } from "sonner"
import { RecurringTaskInput, RecurringTaskUpdate } from "@/lib/types/recurring-tasks"

export function RecurringTasksView() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { tasks, loading, addTask, updateTask, deleteTask } = useRecurringTasks()
  const { user } = useAuth()

  const handleAddTask = async (taskInput: RecurringTaskInput) => {
    try {
      if (!user) {
        toast.error("Please sign in to create tasks")
        return
      }

      if (!taskInput.title || !taskInput.schedule?.frequency) {
        toast.error("Task title and frequency are required")
        return
      }

      await addTask(
        taskInput.title,
        taskInput.schedule.frequency,
        {
          time: taskInput.time,
          client_id: taskInput.client_id,
          project_id: taskInput.project_id,
          weekDay: taskInput.schedule.weekDay,
          monthDay: taskInput.schedule.monthDay
        }
      )
      setShowCreateDialog(false)
      toast.success("Task created successfully")
    } catch (error: any) {
      console.error("Error creating task:", error)
      toast.error(error.message || "Failed to create task")
    }
  }

  const handleUpdateTask = async (id: string, updates: RecurringTaskUpdate) => {
    try {
      if (!user) {
        toast.error("Please sign in to update tasks")
        return
      }

      await updateTask(id, updates)
      toast.success("Task updated successfully")
    } catch (error: any) {
      console.error("Error updating task:", error)
      toast.error(error.message || "Failed to update task")
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
    } catch (error: any) {
      console.error("Error deleting task:", error)
      toast.error(error.message || "Failed to delete task")
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
        tasks={tasks}
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