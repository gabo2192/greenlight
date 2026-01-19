'use client'

import { Task } from '@/types/tasks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useTasks () {
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: () => fetch('/api/tasks').then(res => res.json())
  })

  const createTaskMutation = useMutation<Task, Error, { title: string }>({
    mutationFn: data =>
      fetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const updateTaskMutation = useMutation<Task, Error, { id: string }>({
    mutationFn: data =>
      fetch(`/api/tasks`, {
        method: 'PATCH',
        body: JSON.stringify({ id: data.id })
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  return {
    tasks: data,
    isLoading,
    error,
    createTaskMutation,
    updateTaskMutation
  }
}
