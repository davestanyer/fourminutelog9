"use client"

import { useState, useCallback } from "react"
import { Plus, Clock, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CompletedTaskItem } from "@/components/log/completed-task-item"
import { TimeSelector } from "@/components/log/time-selector"
import { TagSelector } from "@/components/log/tag-selector"
import { Task } from "@/lib/types"

interface CompletedTaskListProps {
  tasks: Task[]
  onAdd: (content: string) => void
  onUncomplete: (id: string) => void
  onUpdate: (id: string, updates: { content?: string; time?: string; client_tag_id?: string | null; project_tag_id?: string | null }) => void
  onDelete: (id: string) => void
}

export function CompletedTaskList({
  tasks,
  onAdd,
  onUncomplete,
  onUpdate,
  onDelete
}: CompletedTaskListProps) {
  const [newTask, setNewTask] = useState("")
  const [timeSelector, setTimeSelector] = useState<{ show: boolean; taskId: string | null }>({ 
    show: false, 
    taskId: null 
  })
  const [tagSelector, setTagSelector] = useState<{ show: boolean; taskId: string | null }>({ 
    show: false, 
    taskId: null 
  })

  const handleAddTask = useCallback(() => {
    if (newTask.trim()) {
      onAdd(newTask.trim())
      setNewTask("")
    }
  }, [newTask, onAdd])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTask()
    }
  }, [handleAddTask])

  const handleTimeClick = useCallback((taskId: string | null) => {
    setTimeSelector({ show: true, taskId })
  }, [])

  const handleTagClick = useCallback((taskId: string | null) => {
    setTagSelector({ show: true, taskId })
  }, [])

  const handleTimeSelect = useCallback((time: string) => {
    if (timeSelector.taskId) {
      onUpdate(timeSelector.taskId, { time })
    }
    setTimeSelector({ show: false, taskId: null })
  }, [timeSelector.taskId, onUpdate])

  const handleTagSelect = useCallback((clientId: string | null, projectId: string | null) => {
    if (tagSelector.taskId) {
      onUpdate(tagSelector.taskId, {
        client_tag_id: clientId,
        project_tag_id: projectId
      })
    }
    setTagSelector({ show: false, taskId: null })
  }, [tagSelector.taskId, onUpdate])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Completed Tasks</h3>
      
      <div className="space-y-2">
        {tasks.map((task) => (
          <CompletedTaskItem
            key={task.id}
            task={task}
            onUncomplete={() => onUncomplete(task.id)}
            onUpdate={(updates) => onUpdate(task.id, updates)}
            onDelete={() => onDelete(task.id)}
            onTimeClick={() => handleTimeClick(task.id)}
            onTagClick={() => handleTagClick(task.id)}
          />
        ))}

        <div className="flex gap-2">
          <Input
            placeholder="Add a completed task (press Enter to save)"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            size="icon"
            variant="outline"
            onClick={() => handleTimeClick(null)}
          >
            <Clock className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => handleTagClick(null)}
          >
            <Tag className="h-4 w-4" />
          </Button>
          <Button size="icon" onClick={handleAddTask}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {timeSelector.show && (
        <TimeSelector onSelect={handleTimeSelect} />
      )}

      {tagSelector.show && (
        <TagSelector onSelect={handleTagSelect} />
      )}
    </div>
  )
}
