"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { useTasks } from "@/lib/hooks/use-tasks";
import { TaskList } from "@/components/log/task-list";
import { HistoryTimeline } from "@/components/log/history-timeline";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Loading } from "../loading";

function formatTimeTotal(minutes: number): string {
  if (minutes === 0) return "0m";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);

  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
}

export function DailyLogView() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const {
    todoTasks,
    completedTasks,
    todoTime,
    completedTime,
    loading,
    addTask,
    updateTask,
    deleteTask,
  } = useTasks(selectedDate);

  const handleAddTask = async (
    content: string,
    isCompleted: boolean = false
  ) => {
    try {
      await addTask({
        content: content,
        completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
      });
      toast.success("Task added successfully");
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await updateTask(taskId, {
        completed: true,
        completed_at: new Date(selectedDate).toISOString(), // Use selected date for completion
      });
      toast.success("Task completed");
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Failed to complete task");
    }
  };

  const handleUncompleteTask = async (taskId: string) => {
    try {
      await updateTask(taskId, {
        completed: false,
        completed_at: null,
      });
      toast.success("Task moved back to todo");
    } catch (error) {
      console.error("Error uncompleting task:", error);
      toast.error("Failed to move task");
    }
  };

  const handleUpdateTask = async (
    taskId: string,
    updates: {
      content?: string;
      time?: string;
      client_tag_id?: string | null;
      project_tag_id?: string | null;
    }
  ) => {
    try {
      await updateTask(taskId, updates);
      toast.success("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
      </div>

      <Card className="p-6">
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h2>
            <div className="flex items-center gap-4">
              {todoTime > 0 && (
                <Badge variant="outline" className="h-6">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="text-muted-foreground">To do:</span>
                  <span className="ml-1 font-medium">
                    {formatTimeTotal(todoTime)}
                  </span>
                </Badge>
              )}
              <Badge variant="secondary" className="h-6">
                <Clock className="h-3 w-3 mr-1" />
                <span className="text-muted-foreground">Completed:</span>
                <span className="ml-1 font-medium">
                  {formatTimeTotal(completedTime)}
                </span>
              </Badge>
            </div>
          </div>
        </div>
        <Separator className="mb-6" />

        <div className="mb-8">
          <TaskList
            title="Tasks to do"
            tasks={todoTasks}
            onAdd={handleAddTask}
            onUpdateComplete={handleCompleteTask}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        </div>

        <div className="mb-8">
          <TaskList
            title="Completed tasks"
            tasks={completedTasks}
            onAdd={(content) => handleAddTask(content, true)}
            onUpdateComplete={handleUncompleteTask}
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
  );
}
