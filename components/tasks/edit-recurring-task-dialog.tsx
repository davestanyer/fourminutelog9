"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecurringTask } from "@/lib/hooks/use-recurring-tasks";
import { useClients } from "@/lib/hooks/use-clients";
import { toast } from "sonner";

interface EditRecurringTaskDialogProps {
  task: RecurringTask;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (updates: Partial<RecurringTask>) => void;
}

const DURATIONS = [
  { value: "15m", label: "15 minutes" },
  { value: "30m", label: "30 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "2h", label: "2 hours" },
  { value: "3h", label: "3 hours" },
  { value: "4h", label: "4 hours" },
  { value: "8h", label: "8 hours" },
];

export function EditRecurringTaskDialog({
  task,
  open,
  onOpenChange,
  onSubmit,
}: EditRecurringTaskDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [duration, setDuration] = useState(task.time || "");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">(task.frequency);
  const [weekDay, setWeekDay] = useState<number>(task.week_day || 0);
  const [monthDay, setMonthDay] = useState<number>(task.month_day || 1);
  const [selectedClientId, setSelectedClientId] = useState(task.client_id || null);
  const [selectedProjectId, setSelectedProjectId] = useState(task.project_id || null);

  const { clients } = useClients();

  useEffect(() => {
    if (open) {
      setTitle(task.title);
      setDuration(task.time || "");
      setFrequency(task.frequency);
      setWeekDay(task.week_day || 0);
      setMonthDay(task.month_day || 1);
      setSelectedClientId(task.client_id || null);
      setSelectedProjectId(task.project_id || null);
    }
  }, [open, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    onSubmit({
      title: title.trim(),
      time: duration || null,
      client_id: selectedClientId || null,
      project_id: selectedProjectId || null,
      frequency,
      week_day: frequency === "weekly" ? weekDay : null,
      month_day: frequency === "monthly" ? monthDay : null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Recurring Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Duration</Label>
            <Select
              value={duration || "none"}
              onValueChange={(value) => setDuration(value === "none" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
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
              value={selectedClientId || "none"}
              onValueChange={(value) => {
                setSelectedClientId(value === "none" ? null : value);
                setSelectedProjectId(null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
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
                value={selectedProjectId || "none"}
                onValueChange={(value) => setSelectedProjectId(value === "none" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {clients
                    .find((c) => c.id === selectedClientId)
                    ?.projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select
              value={frequency || "none"}
              onValueChange={(value) => setFrequency(value as "daily" | "weekly" | "monthly")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {frequency === "weekly" && (
            <div className="space-y-2">
              <Label>Day of Week</Label>
              <Select
                value={weekDay.toString()}
                onValueChange={(value) => setWeekDay(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                    (day, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {day}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {frequency === "monthly" && (
            <div className="space-y-2">
              <Label>Day of Month</Label>
              <Select
                value={monthDay.toString()}
                onValueChange={(value) => setMonthDay(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
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

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
