import { ShowCompletedTasks } from '@/components/sections/show-completed-tasks'
import { TaskForm } from '@/components/sections/task-form'
import { TaskList } from '@/components/sections/task-list'
import { Separator } from '@/components/ui/separator'

export default function Page () {
  return (
    <div className='flex flex-col h-screen'>
      <h1 className='text-2xl font-bold mb-4 text-center mt-4'>Task Manager</h1>
      <div className='flex flex-col items-center justify-center gap-4'>
        <ShowCompletedTasks />
        <Separator className='my-4' />
        <TaskForm />
        <div className='flex flex-col items-center justify-center gap-4 mt-4'>
          <TaskList />
        </div>
      </div>
    </div>
  )
}
