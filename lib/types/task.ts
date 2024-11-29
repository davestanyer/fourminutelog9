import { Database } from "../database.types";

export type Task = Database["public"]["Tables"]["tasks"]["Row"] & {
  task_client_tags?:
    | Database["public"]["Views"]["task_client_tags"]["Row"]
    | null;
  task_project_tags?:
    | Database["public"]["Views"]["task_project_tags"]["Row"]
    | null;
};

export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
