import { Database } from "../database.types";

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: "admin" | "user";
//   avatar?: string;
//   createdAt: string;
// }

export type User = Database["public"]["Tables"]["users"]["Row"];
