'use client'
import { Button } from '@/components/ui/button'
import { useTasks } from '@/hooks/useTasks'
import { Task } from '@/types/tasks'
import { CheckIcon, TrashIcon, XIcon } from '@phosphor-icons/react'

export function TaskList () {
  const { tasks, isLoading, error, updateTaskMutation, deleteTaskMutation } =
    useTasks()
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!tasks || tasks.length === 0) return <div>No tasks found</div>

  return (
    <ul className='list-none p-0 m-0'>
      {tasks?.map((task: Task) => (
        <TaskItemComponent
          key={task.id}
          title={task.title}
          completed={task.completed ?? false}
          onDone={() => {
            updateTaskMutation.mutate({ id: task.id })
          }}
          onDelete={() => {
            deleteTaskMutation.mutate({ id: task.id })
          }}
        />
      ))}
    </ul>
  )
}

function TaskItemComponent ({
  title,
  onDone,
  onDelete,
  completed
}: {
  title: string
  onDone: () => void
  onDelete: () => void
  completed: boolean
}) {
  return (
    <li className='flex items-center justify-between gap-4'>
      <span className='text-lg font-bold'>{title}</span>
      <div className='flex items-center gap-2'>
        {completed ? (
          <Button onClick={onDone}>
            <XIcon /> Mark as not done
          </Button>
        ) : (
          <Button onClick={onDone}>
            <CheckIcon /> Done
          </Button>
        )}
        <Button onClick={onDelete}>
          <TrashIcon /> Trash
        </Button>
      </div>
    </li>
  )
}
