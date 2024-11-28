"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Task } from "@/lib/types"
import { useClients } from "@/lib/hooks/use-clients"

interface EditRecurringTaskDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (updates: Partial<Task>) => void
}

const DURATIONS = [
  { value: "15m", label: "15 minutes" },
  { value: "30m", label: "30 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "2h", label: "2 hours" },
  { value: "3h", label: "3 hours" },
  { value: "4h", label: "4 hours" },
  { value: "8h", label: "8 hours" },
]

export function EditRecurringTaskDialog({
  task,
  open,
  onOpenChange,
  onSubmit,
}: EditRecurringTaskDialogProps) {
  const [content, setContent] = useState(task.content)
  const [duration, setDuration] = useState(task.time || "")
  const [selectedClientId, setSelectedClientId] = useState<string | null>(task.client_tag_id || null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(task.project_tag_id || null)

  const { clients, loading: clientsLoading } = useClients()

  useEffect(() => {
    if (open) {
      setContent(task.content)
      setDuration(task.time || "")
      setSelectedClientId(task.client_tag_id)
      setSelectedProjectId(task.project_tag_id)
    }
  }, [open, task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      content,
      time: duration || null,
      client_tag_id: selectedClientId,
      project_tag_id: selectedProjectId
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Task Content</Label>
            <Input
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter task content"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {DURATIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Client</Label>
            <Select 
              value={selectedClientId || ""} 
              onValueChange={(value) => {
                setSelectedClientId(value || null)
                setSelectedProjectId(null)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.emoji} {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedClientId && (
            <div className="space-y-2">
              <Label>Project (Optional)</Label>
              <Select 
                value={selectedProjectId || ""} 
                onValueChange={(value) => setSelectedProjectId(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {clients
                    .find(c => c.id === selectedClientId)
                    ?.projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
