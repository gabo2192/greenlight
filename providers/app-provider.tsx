'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, useContext, useState } from 'react'

const queryClient = new QueryClient()

type TaskFiltersContextType = {
  showCompleted: boolean
  setShowCompleted: (value: boolean) => void
}

const TaskFiltersContext = createContext<TaskFiltersContextType | null>(null)

export function useTaskFilters () {
  const context = useContext(TaskFiltersContext)
  if (!context) {
    throw new Error('useTaskFilters must be used within an AppProvider')
  }
  return context
}

export function AppProvider ({ children }: { children: React.ReactNode }) {
  const [showCompleted, setShowCompleted] = useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      <TaskFiltersContext.Provider value={{ showCompleted, setShowCompleted }}>
        {children}
      </TaskFiltersContext.Provider>
    </QueryClientProvider>
  )
}
