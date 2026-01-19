'use client'
import { Button } from '@/components/ui/button'
import { useTasks } from '@/hooks/useTasks'
import { Task } from '@/types/tasks'
import { CheckIcon, TrashIcon } from '@phosphor-icons/react'

export function TaskList () {
  const { tasks, isLoading, error } = useTasks()
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return (
    <ul className='list-none p-0 m-0'>
      {tasks?.map((task: Task) => (
        <TaskItemComponent
          key={task.id}
          title={task.title}
          onDone={() => {}}
          onDelete={() => {}}
        />
      ))}
    </ul>
  )
}

function TaskItemComponent ({
  title,
  onDone,
  onDelete
}: {
  title: string
  onDone: () => void
  onDelete: () => void
}) {
  return (
    <li className='flex items-center justify-between gap-4'>
      <span className='text-lg font-bold'>{title}</span>
      <div className='flex items-center gap-2'>
        <Button onClick={onDone}>
          <CheckIcon /> Done
        </Button>
        <Button onClick={onDelete}>
          <TrashIcon /> Trash
        </Button>
      </div>
    </li>
  )
}
