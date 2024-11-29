// import { Database } from './database.types'

// // Task type with client and project tag views
// export type TaskClientTag = Database['public']['Views']['task_client_tags']['Row']
// export type TaskProjectTag = Database['public']['Views']['task_project_tags']['Row']

// export type Task = Database['public']['Tables']['tasks']['Row'] & {
//   task_client_tags?: TaskClientTag | null
//   task_project_tags?: TaskProjectTag | null
// }

// // Basic task interfaces for local state management
// export interface TodoTask {
//   id: string
//   content: string
//   completed: boolean
//   time?: string
//   tags?: string[]
// }

// export interface CompletedTask {
//   id: string
//   content: string
//   time?: string
//   tags?: string[]
//   completedAt: string
// }
