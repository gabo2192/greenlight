'use client'

import { useTaskFilters } from '@/providers/app-provider'
import { Task } from '@/types/tasks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useTasks () {
  const queryClient = useQueryClient()
  const { showCompleted, setShowCompleted } = useTaskFilters()

  const { data, isLoading, error } = useQuery<Task[], Error>({
    queryKey: ['tasks', { showCompleted }],
    queryFn: () =>
      fetch(`/api/tasks?showCompleted=${showCompleted}`).then(res => res.json())
  })

  const createTaskMutation = useMutation<Task, Error, { title: string }>({
    mutationFn: data =>
      fetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: error => {
      toast.error(error?.message ?? 'Failed to create task')
    }
  })

  const updateTaskMutation = useMutation<Task, Error, { id: string }>({
    mutationFn: data =>
      fetch(`/api/tasks/${data.id}`, {
        method: 'PATCH'
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: error => {
      toast.error(error?.message ?? 'Failed to update task')
    }
  })

  const deleteTaskMutation = useMutation<Task, Error, { id: string }>({
    mutationFn: data =>
      fetch(`/api/tasks`, {
        method: 'DELETE',
        body: JSON.stringify({ id: data.id })
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: error => {
      toast.error(error?.message ?? 'Failed to delete task')
    }
  })

  const toggleShowCompleted = () => {
    setShowCompleted(!showCompleted)
  }

  return {
    tasks: data,
    isLoading,
    error,
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    toggleShowCompleted,
    showCompleted
  }
}
