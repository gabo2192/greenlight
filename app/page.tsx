import { TaskForm } from '@/components/sections/task-form'
import { TaskList } from '@/components/sections/task-list'

export default function Page () {
  //   const serverURL = process.env.SERVER_URL!
  //   const tasks = await fetch(`${serverURL}/api/tasks`).then(res => res.json())
  //   console.log(tasks)
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-2xl font-bold mb-4'>Task Manager</h1>
      <TaskForm />
      <div className='flex flex-col items-center justify-center gap-4'>
        <TaskList />
      </div>
    </div>
  )
}
