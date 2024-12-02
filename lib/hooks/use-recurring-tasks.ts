"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'
import { useAuth } from '@/lib/hooks/use-auth'
import { toast } from 'sonner'

export interface RecurringTask {
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
  clients?: {
    id: string
    name: string
    emoji: string
  } | null
  projects?: {
    id: string
    name: string
  } | null
}

export function useRecurringTasks() {
  const [tasks, setTasks] = useState<RecurringTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()

  const fetchTasks = async () => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('recurring_tasks')
        .select(`
          *,
          clients (
            id,
            name,
            emoji
          ),
          projects (
            id,
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedTasks: RecurringTask[] = (data || []).map(task => ({
        id: task.id,
        user_id: task.user_id,
        title: task.title,
        time: task.time,
        client_id: task.client_id,
        project_id: task.project_id,
        frequency: task.frequency,
        week_day: task.week_day,
        month_day: task.month_day,
        created_at: task.created_at,
        clients: Array.isArray(task.clients) && task.clients.length > 0 
          ? task.clients[0] 
          : null,
        projects: Array.isArray(task.projects) && task.projects.length > 0 
          ? task.projects[0] 
          : null
      }))

      setTasks(formattedTasks)
    } catch (e) {
      const err = e as Error
      setError(err)
      console.error('Error fetching tasks:', err)
      toast.error('Failed to load recurring tasks')
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
      const taskData = {
        user_id: user.id,
        title,
        frequency,
        time: options?.time || null,
        client_id: options?.client_id || null,
        project_id: options?.project_id || null,
        week_day: options?.weekDay || null,
        month_day: options?.monthDay || null
      }

      const { data, error } = await supabase
        .from('recurring_tasks')
        .insert([taskData])
        .select(`
          *,
          clients (
            id,
            name,
            emoji
          ),
          projects (
            id,
            name
          )
        `)
        .single()

      if (error) throw error

      const newTask: RecurringTask = {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        time: data.time,
        client_id: data.client_id,
        project_id: data.project_id,
        frequency: data.frequency,
        week_day: data.week_day,
        month_day: data.month_day,
        created_at: data.created_at,
        clients: Array.isArray(data.clients) && data.clients.length > 0 
          ? data.clients[0] 
          : null,
        projects: Array.isArray(data.projects) && data.projects.length > 0 
          ? data.projects[0] 
          : null
      }

      setTasks(prev => [newTask, ...prev])
      return newTask
    } catch (e) {
      console.error('Error adding task:', e)
      throw e
    }
  }

  const updateTask = async (id: string, updates: {
    title?: string
    time?: string | null
    client_id?: string | null
    project_id?: string | null
    frequency?: 'daily' | 'weekly' | 'monthly'
    week_day?: number | null
    month_day?: number | null
  }) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      const { data, error } = await supabase
        .from('recurring_tasks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select(`
          *,
          clients (
            id,
            name,
            emoji
          ),
          projects (
            id,
            name
          )
        `)
        .single()

      if (error) throw error

      const updatedTask: RecurringTask = {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        time: data.time,
        client_id: data.client_id,
        project_id: data.project_id,
        frequency: data.frequency,
        week_day: data.week_day,
        month_day: data.month_day,
        created_at: data.created_at,
        clients: Array.isArray(data.clients) && data.clients.length > 0 
          ? data.clients[0] 
          : null,
        projects: Array.isArray(data.projects) && data.projects.length > 0 
          ? data.projects[0] 
          : null
      }

      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ))

      return updatedTask
    } catch (e) {
      console.error('Error updating task:', e)
      throw e
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
    } catch (e) {
      console.error('Error deleting task:', e)
      throw e
    }
  }

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask
  }
}
