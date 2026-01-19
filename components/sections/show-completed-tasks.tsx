'use client'
import { useTasks } from '@/hooks/useTasks'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'

export function ShowCompletedTasks () {
  const { toggleShowCompleted, showCompleted } = useTasks()

  return (
    <div className='flex items-center gap-2'>
      <Switch
        onCheckedChange={toggleShowCompleted}
        checked={showCompleted}
        id='show-completed-tasks'
      />
      <Label htmlFor='show-completed-tasks'>Show completed tasks</Label>
    </div>
  )
}
