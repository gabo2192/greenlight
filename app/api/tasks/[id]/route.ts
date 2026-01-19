import { tasksTable } from '@/db/schema'
import db from '@/lib/db'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const taskId = parseInt(id, 10)

  if (isNaN(taskId)) {
    return NextResponse.json(
      { error: { message: 'Invalid task ID' } },
      { status: 400 }
    )
  }

  // First, get the current task to toggle its completed status
  const [existingTask] = await db
    .select()
    .from(tasksTable)
    .where(eq(tasksTable.id, taskId))

  if (!existingTask) {
    return NextResponse.json(
      { error: { message: 'Task not found' } },
      { status: 404 }
    )
  }

  const [updatedTask] = await db
    .update(tasksTable)
    .set({ completed: !existingTask.completed })
    .where(eq(tasksTable.id, taskId))
    .returning()

  if (!updatedTask) {
    return NextResponse.json(
      { error: { message: 'Failed to update task' } },
      { status: 500 }
    )
  }

  return NextResponse.json({ message: 'Task updated' }, { status: 200 })
}
