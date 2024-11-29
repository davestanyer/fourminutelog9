"use client";

import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskItem } from "@/components/log/task-item";
import { Task } from "@/lib/types/task";

interface TaskListProps {
  title: string;
  tasks: Task[];
  onAdd: (content: string) => void;
  onUpdateComplete: (id: string) => void;
  onUpdate: (
    id: string,
    updates: {
      content?: string;
      time?: string;
      client_tag_id?: string | null;
      project_tag_id?: string | null;
    }
  ) => void;
  onDelete: (id: string) => void;
}

export function TaskList({
  title,
  tasks,
  onAdd,
  onUpdateComplete,
  onUpdate,
  onDelete,
}: TaskListProps) {
  const [newTask, setNewTask] = useState("");

  const handleAddTask = useCallback(() => {
    if (newTask.trim()) {
      onAdd(newTask.trim());
      setNewTask("");
    }
  }, [newTask, onAdd]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleAddTask();
      }
    },
    [handleAddTask]
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdateComplete={() => onUpdateComplete(task.id)}
            onUpdate={(updates) => onUpdate(task.id, updates)}
            onDelete={() => onDelete(task.id)}
          />
        ))}

        <div className="flex gap-2">
          <Input
            placeholder="Add a new task (press Enter to save)"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button size="icon" onClick={handleAddTask}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
