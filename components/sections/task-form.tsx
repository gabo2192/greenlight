'use client'
import { useTasks } from '@/hooks/useTasks'
import { PlusIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export function TaskForm () {
  const [title, setTitle] = useState('')
  const { createTaskMutation } = useTasks()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createTaskMutation.mutate({ title })
    setTitle('')
    toast.success('Task created successfully')
  }
  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-row items-center justify-start gap-4'
    >
      <Input
        type='text'
        placeholder='Add a new task'
        className='border border-gray-300 rounded-md p-2'
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <Button type='submit'>
        <PlusIcon />
        Add
      </Button>
    </form>
  )
}
