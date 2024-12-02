"use client"

import { useState, KeyboardEvent } from "react"
import { Plus, Clock, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TaskItem } from "@/components/log/task-item"
import { TimeSelector } from "@/components/log/time-selector"
import { TagSelector } from "@/components/log/tag-selector"
import { Task } from "@/lib/types"

interface LogEntryProps {
  date: Date
  tasks: Task[]
  onUpdate: (tasks: Task[]) => void
  isCollapsed?: boolean
}

export function LogEntry({ date, tasks, onUpdate, isCollapsed = false }: LogEntryProps) {
  const [newTask, setNewTask] = useState("")
  const [showTimeSelector, setShowTimeSelector] = useState(false)
  const [showTagSelector, setShowTagSelector] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTask.trim()) {
      const newTaskData: Task = {
        id: crypto.randomUUID(),
        user_id: "", // This will be set by the backend
        content: newTask.trim(),
        completed: false,
        completed_at: null,
        time: null,
        client_tag_id: null,
        project_tag_id: null,
        created_at: new Date().toISOString(),
        task_client_tags: null,
        task_project_tags: null
      }
      onUpdate([...tasks, newTaskData])
      setNewTask("")
    }
  }

  const updateTask = (id: string, updates: Partial<{
    content: string
    time: string | null
    client_tag_id: string | null
    project_tag_id: string | null
  }>) => {
    onUpdate(tasks.map(task => 
      task.id === id ? { 
        ...task,
        ...updates
      } : task
    ))
  }

  const completeTask = (id: string) => {
    onUpdate(tasks.map(task =>
      task.id === id ? {
        ...task,
        completed: true,
        completed_at: new Date().toISOString()
      } : task
    ))
  }

  const deleteTask = (id: string) => {
    onUpdate(tasks.filter(task => task.id !== id))
  }

  const handleTimeSelect = (time: string | null) => {
    if (selectedTaskId) {
      updateTask(selectedTaskId, { time })
    }
    setShowTimeSelector(false)
    setSelectedTaskId(null)
  }

  const handleTagSelect = (clientId: string | null, projectId: string | null) => {
    if (selectedTaskId) {
      updateTask(selectedTaskId, {
        client_tag_id: clientId,
        project_tag_id: projectId
      })
    }
    setShowTagSelector(false)
    setSelectedTaskId(null)
  }

  const handleAddTask = () => {
    if (newTask.trim()) {
      const newTaskData: Task = {
        id: crypto.randomUUID(),
        user_id: "", // This will be set by the backend
        content: newTask.trim(),
        completed: false,
        completed_at: null,
        time: null,
        client_tag_id: null,
        project_tag_id: null,
        created_at: new Date().toISOString(),
        task_client_tags: null,
        task_project_tags: null
      }
      onUpdate([...tasks, newTaskData])
      setNewTask("")
    }
  }

  return (
    <div className="space-y-4">      
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onComplete={() => completeTask(task.id)}
            onUpdate={(updates) => updateTask(task.id, updates)}
            onDelete={() => deleteTask(task.id)}
            onTimeClick={() => {
              setSelectedTaskId(task.id)
              setShowTimeSelector(true)
            }}
            onTagClick={() => {
              setSelectedTaskId(task.id)
              setShowTagSelector(true)
            }}
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            Start adding tasks to your log...
          </p>
        )}
      </div>

      {!isCollapsed && (
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Add a new task (press Enter to save)"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setSelectedTaskId(null)
              setShowTimeSelector(true)
            }}
          >
            <Clock className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setSelectedTaskId(null)
              setShowTagSelector(true)
            }}
          >
            <Tag className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={handleAddTask}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      {showTimeSelector && (
        <div className="relative">
          <TimeSelector onSelect={handleTimeSelect} />
        </div>
      )}

      {showTagSelector && (
        <div className="relative">
          <TagSelector onSelect={handleTagSelect} />
        </div>
      )}
    </div>
  )
}