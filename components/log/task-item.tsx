"use client";

import { useState } from "react";
import {
  Square,
  Clock,
  Tag,
  Trash2,
  Pencil,
  Check,
  X,
  CheckSquare2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/lib/types/task";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { TimeSelector } from "./time-selector";
import { TagSelector } from "./tag-selector";
import { format } from "date-fns";

interface TaskItemProps {
  task: Task;
  onUpdateComplete: () => void;
  onUpdate: (updates: {
    content?: string;
    time?: string;
    client_tag_id?: string | null;
    project_tag_id?: string | null;
  }) => void;
  onDelete: () => void;
}

export function TaskItem({
  task,
  onUpdateComplete,
  onUpdate,
  onDelete,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(task.content);

  return (
    <div className="group flex items-center gap-2 p-2 rounded-md hover:bg-accent">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={onUpdateComplete}
      >
        {task.completed ? (
          <CheckSquare2 className="h-4 w-4" />
        ) : (
          <Square className="h-4 w-4" />
        )}
      </Button>

      {isEditing ? (
        <>
          <Input
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="flex-1"
            autoFocus
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              onUpdate({ content: editedContent });
              setIsEditing(false);
            }}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              setEditedContent(task.content);
              setIsEditing(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <div className="flex-1 space-y-1">
            <span className="text-foreground">{task.content}</span>
            <div className="text-xs text-muted-foreground">
              {task.completed_at &&
                `Completed at ${format(new Date(task.completed_at), "h:mm a")}`}
            </div>
          </div>

          {task.time && (
            <Badge variant="secondary" className="h-6">
              <Clock className="h-3 w-3 mr-1" />
              {task.time}
            </Badge>
          )}

          {task.task_client_tags && (
            <Badge
              variant="outline"
              className="h-6"
              style={{
                backgroundColor: `${task.task_client_tags.color}20`,
                borderColor: task.task_client_tags.color,
              }}
            >
              <span>
                {task.task_client_tags.emoji} {task.task_client_tags.name}
              </span>
              {task.task_project_tags && (
                <>
                  <span className="mx-1">/</span>
                  {task.task_project_tags.name}
                </>
              )}
            </Badge>
          )}

          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Clock className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="center" className="w-fit">
                <TimeSelector
                  onSelect={(time) => {
                    onUpdate({ time });
                  }}
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Tag className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="center" className="w-fit min-w-[200px]">
                <TagSelector
                  onSelect={(clientId, projectId) => {
                    onUpdate({
                      client_tag_id: clientId,
                      project_tag_id: projectId,
                    });
                  }}
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => {
                setIsEditing(true);
                setEditedContent(task.content);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
