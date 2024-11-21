"use client"

import { useState, useMemo } from "react"
import { format, startOfDay, endOfDay, isWithinInterval } from "date-fns"
import { Card } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { Separator } from "@/components/ui/separator"
import { useTasks } from "@/lib/hooks/use-tasks"
import { TaskList } from "@/components/log/task-list"
import { CompletedTaskList } from "@/components/log/completed-task-list"
import { HistoryTimeline } from "@/components/log/history-timeline"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { Task } from "@/lib/types"

function calculateTotalTime(tasks: Task[]): number {
  return tasks.reduce((total, task) => {
    if (!task.time) return total
    
    const match = task.time.match(/(\d+(?:\.\d+)?)(h|m)/)
    if (!match) return total
    
    const [, value, unit] = match
    const numValue = parseFloat(value)
    
    // Convert to minutes
    return total + (unit === 'h' ? numValue * 60 : numValue)
  }, 0)
}

function formatTimeTotal(minutes: number): string {
  if (minutes === 0) return '0m'
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = Math.round(minutes % 60)
  
  if (hours === 0) return `${remainingMinutes}m`
  if (remainingMinutes === 0) return `${hours}h`
  return `${hours}h ${remainingMinutes}m`
}

export function DailyLogView() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks(selectedDate)

  // Memoize the filtered tasks and time calculations
  const { todoTasks, completedTasks, todoTime, completedTime } = useMemo(() => {
    const selectedDayStart = startOfDay(selectedDate)
    const selectedDayEnd = endOfDay(selectedDate)

    // Filter tasks:
    // 1. Todo tasks: Show all incomplete tasks regardless of date
    // 2. Completed tasks: Only show tasks completed on the selected date
    const todo = tasks.filter(task => !task.completed)
    const completed = tasks.filter(task => 
      task.completed && 
      task.completed_at && 
      isWithinInterval(new Date(task.completed_at), {
        start: selectedDayStart,
        end: selectedDayEnd
      })
    )
    
    return {
      todoTasks: todo,
      completedTasks: completed,
      todoTime: calculateTotalTime(todo),
      completedTime: calculateTotalTime(completed)
    }
  }, [tasks, selectedDate])

  const handleAddTask = async (content: string, isCompleted: boolean = false) => {
    try {
      const task = await addTask(content)
      if (task && isCompleted) {
        await updateTask(task.id, {
          completed: true,
          completed_at: new Date().toISOString()
        })
      }
      toast.success("Task added successfully")
    } catch (error) {
      console.error('Error adding task:', error)
      toast.error("Failed to add task")
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    try {
      await updateTask(taskId, {
        completed: true,
        completed_at: new Date(selectedDate).toISOString() // Use selected date for completion
      })
      toast.success("Task completed")
    } catch (error) {
      console.error('Error completing task:', error)
      toast.error("Failed to complete task")
    }
  }

  const handleUncompleteTask = async (taskId: string) => {
    try {
      await updateTask(taskId, { 
        completed: false, 
        completed_at: null 
      })
      toast.success("Task moved back to todo")
    } catch (error) {
      console.error('Error uncompleting task:', error)
      toast.error("Failed to move task")
    }
  }

  const handleUpdateTask = async (taskId: string, updates: {
    content?: string
    time?: string
    client_tag_id?: string | null
    project_tag_id?: string | null
  }) => {
    try {
      await updateTask(taskId, updates)
      toast.success("Task updated successfully")
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error("Failed to update task")
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId)
      toast.success("Task deleted successfully")
    } catch (error) {
      console.error('Error deleting task:', error)
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <DatePicker
          date={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

      <Card className="p-6">
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h2>
            <div className="flex items-center gap-4">
              {todoTime > 0 && (
                <Badge variant="outline" className="h-6">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="text-muted-foreground">To do:</span>
                  <span className="ml-1 font-medium">{formatTimeTotal(todoTime)}</span>
                </Badge>
              )}
              <Badge variant="secondary" className="h-6">
                <Clock className="h-3 w-3 mr-1" />
                <span className="text-muted-foreground">Completed:</span>
                <span className="ml-1 font-medium">{formatTimeTotal(completedTime)}</span>
              </Badge>
            </div>
          </div>
        </div>
        <Separator className="mb-6" />
        
        <div className="mb-8">
          <TaskList
            tasks={todoTasks}
            onAdd={handleAddTask}
            onComplete={handleCompleteTask}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        </div>

        <div className="mb-8">
          <CompletedTaskList
            tasks={completedTasks}
            onAdd={(content) => handleAddTask(content, true)}
            onUncomplete={handleUncompleteTask}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        </div>

        <div className="mt-12">
          <Separator className="mb-8" />
          <h3 className="text-lg font-semibold mb-6">Previous Activity</h3>
          <HistoryTimeline excludeDate={selectedDate} />
        </div>
      </Card>
    </div>
  )
}
