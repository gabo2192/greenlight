import { SelectTask, tasksTable } from '@/db/schema'
import db from '@/lib/db'
import { and, eq, isNull } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET (request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const showCompleted = searchParams.get('showCompleted') === 'true'
  const tasks: SelectTask[] = await db
    .select()
    .from(tasksTable)
    .where(
      and(
        isNull(tasksTable.deletedAt),
        showCompleted ? undefined : eq(tasksTable.completed, false)
      )
    )
  return NextResponse.json(tasks ?? [])
}

export async function POST (request: NextRequest) {
  const { title } = await request.json()
  const formattedTitle = title.trim()
  if (formattedTitle.length === 0) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }
  const task = await db
    .insert(tasksTable)
    .values({ title: formattedTitle })
    .returning()

  if (!task) {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }

  return NextResponse.json({ message: 'Task created' }, { status: 201 })
}

export async function PATCH (request: NextRequest) {
  const { id } = await request.json()
  const task = await db
    .update(tasksTable)
    .set({ completed: true })
    .where(eq(tasksTable.id, id))
    .returning()

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Task updated' }, { status: 200 })
}

export async function DELETE (request: NextRequest) {
  const { id } = await request.json()
  const task = await db
    .update(tasksTable)
    .set({ deletedAt: new Date() })
    .where(eq(tasksTable.id, id))
    .returning()

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Task deleted' }, { status: 200 })
}
