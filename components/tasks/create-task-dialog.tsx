"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useClients } from "@/lib/hooks/use-clients"
import { RecurringTaskInput } from "@/lib/types/recurring-tasks"
import { DURATIONS, FREQUENCIES, WEEKDAYS } from "@/lib/constants/recurring-tasks"
import { validateSchedule } from "@/lib/utils/recurring-tasks"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (task: RecurringTaskInput) => void
  type: "recurring" | "one-off"
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  onSubmit,
  type
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("daily")
  const [weekDay, setWeekDay] = useState("1")
  const [monthDay, setMonthDay] = useState("1")
  const [selectedClientId, setSelectedClientId] = useState<string>("")
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")

  const { clients } = useClients()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateSchedule(
      frequency,
      frequency === "weekly" ? parseInt(weekDay) : undefined,
      frequency === "monthly" ? parseInt(monthDay) : undefined
    )) {
      return
    }

    const task: RecurringTaskInput = {
      title,
      time: time || null,
      client_id: selectedClientId || null,
      project_id: selectedProjectId || null,
      schedule: {
        frequency,
        weekDay: frequency === "weekly" ? parseInt(weekDay) : undefined,
        monthDay: frequency === "monthly" ? parseInt(monthDay) : undefined
      }
    }

    onSubmit(task)
    resetForm()
  }

  const resetForm = () => {
    setTitle("")
    setTime("")
    setFrequency("daily")
    setWeekDay("1")
    setMonthDay("1")
    setSelectedClientId("")
    setSelectedProjectId("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Create {type === "recurring" ? "Recurring" : "One-off"} Task
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Duration</Label>
            <Select value={time} onValueChange={setTime}>
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
              value={selectedClientId} 
              onValueChange={(value) => {
                setSelectedClientId(value)
                setSelectedProjectId("")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
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
                value={selectedProjectId} 
                onValueChange={setSelectedProjectId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
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

          {type === "recurring" && (
            <>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select value={frequency} onValueChange={(value: any) => setFrequency(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {frequency === "weekly" && (
                <div className="space-y-2">
                  <Label>Day of Week</Label>
                  <Select value={weekDay} onValueChange={setWeekDay}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WEEKDAYS.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {frequency === "monthly" && (
                <div className="space-y-2">
                  <Label>Day of Month</Label>
                  <Select value={monthDay} onValueChange={setMonthDay}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}