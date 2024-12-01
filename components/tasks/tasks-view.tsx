"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecurringTasks } from "@/components/tasks/recurring-tasks"
import { OneOffTasks } from "@/components/tasks/one-off-tasks"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { useRecurringTasks } from "@/lib/hooks/use-recurring-tasks"
import { useTasks } from "@/lib/hooks/use-tasks"
import { toast } from "sonner"
import { Task } from "@/lib/types"

interface FormattedTask extends Task {
  type: "recurring" | "one-off"
}

export function TasksView() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<"recurring" | "one-off">("recurring")
  
  const { 
    tasks: recurringTasks, 
    addTask: addRecurringTask,
    updateTask: updateRecurringTask,
    deleteTask: deleteRecurringTask,
    loading: recurringLoading
  } = useRecurringTasks()

  const {
    tasks: oneOffTasks,
    addTask: addOneOffTask,
    updateTask: updateOneOffTask,
    deleteTask: deleteOneOffTask,
    loading: oneOffLoading
  } = useTasks()

  const handleSubmit = async (task: Partial<FormattedTask>) => {
    try {
      if (activeTab === "recurring" && task.content) {
        await addRecurringTask(
          task.content,
          'daily',
          {
            time: task.time || undefined,
            client_id: task.client_tag_id || undefined,
            project_id: task.project_tag_id || undefined
          }
        )
      } else if (task.content) {
        await addOneOffTask(task.content)
      }
      setShowCreateDialog(false)
      toast.success("Task created successfully")
    } catch (error) {
      console.error("Error creating task:", error)
      toast.error("Failed to create task")
    }
  }

  const handleUpdate = async (id: string, updates: Partial<FormattedTask>) => {
    try {
      if (activeTab === "recurring") {
        await updateRecurringTask(id, {
          title: updates.content || undefined,
          time: updates.time || undefined,
          client_id: updates.client_tag_id || undefined,
          project_id: updates.project_tag_id || undefined
        })
      } else {
        await updateOneOffTask(id, {
          content: updates.content || undefined,
          time: updates.time || undefined,
          client_tag_id: updates.client_tag_id || undefined,
          project_tag_id: updates.project_tag_id || undefined
        })
      }
      toast.success("Task updated successfully")
    } catch (error) {
      console.error("Error updating task:", error)
      toast.error("Failed to update task")
    }
  }

  const handleDelete = async (id: string, type: "recurring" | "one-off") => {
    try {
      if (type === "recurring") {
        await deleteRecurringTask(id)
      } else {
        await deleteOneOffTask(id)
      }
      toast.success("Task deleted successfully")
    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error("Failed to delete task")
    }
  }

  if (recurringLoading || oneOffLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const formattedRecurringTasks: FormattedTask[] = recurringTasks.map(task => ({
    id: task.id,
    user_id: task.user_id,
    content: task.title,
    completed: false,
    completed_at: null,
    time: task.time || null,
    client_tag_id: task.client_id || null,
    project_tag_id: task.project_id || null,
    created_at: task.created_at,
    task_client_tags: task.clients ? {
      task_id: task.id,
      id: task.clients.id,
      name: task.clients.name,
      emoji: task.clients.emoji,
      color: task.clients.emoji,
      tag: `client:${task.clients.name}`
    } : null,
    task_project_tags: task.projects ? {
      task_id: task.id,
      id: task.projects.id,
      name: task.projects.name,
      client_name: task.clients?.name || '',
      tag: `project:${task.clients?.name}/${task.projects.name}`
    } : null,
    type: "recurring"
  }))

  const formattedOneOffTasks: FormattedTask[] = oneOffTasks.map(task => ({
    ...task,
    type: "one-off"
  }))

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Tasks</h1>
      </div>

      <Card className="p-6">
        <Tabs 
          defaultValue="recurring" 
          className="space-y-4"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "recurring" | "one-off")}
        >
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="recurring">Recurring Tasks</TabsTrigger>
              <TabsTrigger value="one-off">One-off Tasks</TabsTrigger>
            </TabsList>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          <TabsContent value="recurring" className="space-y-4">
            <RecurringTasks
              tasks={formattedRecurringTasks}
              onDelete={(id) => handleDelete(id, "recurring")}
              onUpdate={(id, updates) => handleUpdate(id, updates)}
            />
          </TabsContent>

          <TabsContent value="one-off" className="space-y-4">
            <OneOffTasks
              tasks={formattedOneOffTasks}
              onDelete={(id) => handleDelete(id, "one-off")}
              onUpdate={(id, updates) => handleUpdate(id, updates)}
            />
          </TabsContent>
        </Tabs>
      </Card>

      <CreateTaskDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleSubmit}
        type={activeTab}
      />
    </div>
  )
}
