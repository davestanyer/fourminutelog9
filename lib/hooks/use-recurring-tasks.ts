"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'
import { useAuth } from '@/lib/hooks/use-auth'
import { toast } from 'sonner'

// Extend Database type to include the view
interface DatabaseWithViews extends Database {
  public: Database['public'] & {
    Views: {
      recurring_tasks_with_relations: {
        Row: {
          id: string
          user_id: string
          title: string
          time: string | null
          client_id: string | null
          project_id: string | null
          frequency: 'daily' | 'weekly' | 'monthly'
          week_day: number | null
          month_day: number | null
          created_at: string
          client_name: string | null
          client_emoji: string | null
          project_name: string | null
        }
      }
    }
  }
}

export type RecurringTask = DatabaseWithViews['public']['Views']['recurring_tasks_with_relations']['Row']

export interface RecurringTaskUpdate {
  title?: string
  time?: string | null
  client_id?: string | null
  project_id?: string | null
  frequency?: 'daily' | 'weekly' | 'monthly'
  week_day?: number | null
  month_day?: number | null
}

export function useRecurringTasks() {
  const [tasks, setTasks] = useState<RecurringTask[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchTasks = async () => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('recurring_tasks_with_relations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error: any) {
      console.error('Error fetching tasks:', error)
      toast.error(error.message || 'Failed to load recurring tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchTasks()

      const channel = supabase
        .channel('recurring_tasks_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'recurring_tasks',
            filter: `user_id=eq.${user.id}`
          }, 
          () => {
            fetchTasks()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    } else {
      setTasks([])
      setLoading(false)
    }
  }, [user])

  const addTask = async (
    title: string,
    frequency: 'daily' | 'weekly' | 'monthly',
    options?: {
      time?: string | null
      client_id?: string | null
      project_id?: string | null
      weekDay?: number | null
      monthDay?: number | null
    }
  ) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      if (!title.trim()) {
        throw new Error('Task title is required')
      }

      const taskData = {
        user_id: user.id,
        title: title.trim(),
        frequency,
        time: options?.time || null,
        client_id: options?.client_id || null,
        project_id: options?.project_id || null,
        week_day: frequency === 'weekly' ? options?.weekDay : null,
        month_day: frequency === 'monthly' ? options?.monthDay : null
      }

      const { data, error } = await supabase
        .from('recurring_tasks')
        .insert([taskData])
        .select()
        .single()

      if (error) throw error

      // Fetch the complete task with relations
      const { data: taskWithRelations, error: relationsError } = await supabase
        .from('recurring_tasks_with_relations')
        .select('*')
        .eq('id', data.id)
        .single()

      if (relationsError) throw relationsError

      setTasks(prev => [taskWithRelations, ...prev])
      return taskWithRelations
    } catch (error: any) {
      console.error('Error adding task:', error)
      throw error
    }
  }

  const updateTask = async (id: string, updates: RecurringTaskUpdate) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      if (updates.title && !updates.title.trim()) {
        throw new Error('Task title cannot be empty')
      }

      // Validate frequency-specific fields
      if (updates.frequency === 'weekly' && updates.week_day === undefined) {
        throw new Error('Day of week is required for weekly tasks')
      }
      if (updates.frequency === 'monthly' && updates.month_day === undefined) {
        throw new Error('Day of month is required for monthly tasks')
      }

      // Clear week_day if not weekly
      if (updates.frequency && updates.frequency !== 'weekly') {
        updates.week_day = null
      }

      // Clear month_day if not monthly
      if (updates.frequency && updates.frequency !== 'monthly') {
        updates.month_day = null
      }

      const { error } = await supabase
        .from('recurring_tasks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      // Fetch updated task with relations
      const { data: updatedTask, error: fetchError } = await supabase
        .from('recurring_tasks_with_relations')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ))

      return updatedTask
    } catch (error: any) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  const deleteTask = async (id: string) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      const { error } = await supabase
        .from('recurring_tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (error: any) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask
  }
}
