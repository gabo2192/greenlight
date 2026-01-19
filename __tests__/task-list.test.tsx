import { TaskList } from '@/components/sections/task-list'
import { useTasks } from '@/hooks/useTasks'
import { Task } from '@/types/tasks'
import { UseMutationResult } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, Mock, vi } from 'vitest'

vi.mock('@/hooks/useTasks')

const mockUseTasks = vi.mocked(useTasks)

function mockMutation<TData, TError, TVariables> (
  mutate: Mock
): UseMutationResult<TData, TError, TVariables, unknown> {
  return {
    mutate,
    mutateAsync: vi.fn(),
    data: undefined,
    error: null,
    isError: false,
    isIdle: true,
    isPending: false,
    isSuccess: false,
    status: 'idle',
    reset: vi.fn(),
    context: undefined,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    variables: undefined,
    submittedAt: 0
  }
}

describe('TaskList', () => {
  it('renders tasks and allows marking them as done', async () => {
    const user = userEvent.setup()
    const updateMutate = vi.fn()
    const deleteMutate = vi.fn()

    mockUseTasks.mockReturnValue({
      tasks: [
        { id: '1', title: 'Buy groceries', completed: false },
        { id: '2', title: 'Walk the dog', completed: true }
      ],
      isLoading: false,
      error: null,
      createTaskMutation: mockMutation<Task, Error, { title: string }>(vi.fn()),
      updateTaskMutation: mockMutation<Task, Error, { id: string }>(
        updateMutate
      ),
      deleteTaskMutation: mockMutation<Task, Error, { id: string }>(
        deleteMutate
      ),
      toggleShowCompleted: vi.fn(),
      showCompleted: false
    })

    render(<TaskList />)

    // Verify both tasks are rendered
    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
    expect(screen.getByText('Walk the dog')).toBeInTheDocument()

    // Get each task item to scope our button queries
    const groceriesItem = screen.getByText('Buy groceries').closest('li')!
    const dogItem = screen.getByText('Walk the dog').closest('li')!

    // Incomplete task shows "Done" button, completed task shows "Mark as not done"
    expect(within(groceriesItem).getByText('Done')).toBeInTheDocument()
    expect(within(dogItem).getByText('Mark as not done')).toBeInTheDocument()

    // Click "Done" on the incomplete task (Buy groceries)
    await user.click(
      within(groceriesItem).getByRole('button', { name: /done/i })
    )
    expect(updateMutate).toHaveBeenCalledWith({ id: '1' })

    // Click "Trash" on the completed task (Walk the dog)
    await user.click(within(dogItem).getByRole('button', { name: /trash/i }))
    expect(deleteMutate).toHaveBeenCalledWith({ id: '2' })
  })
})
